'use strict';
const err = require('../err');
const IdentityValidationRequest = require('../../classes/IdentityValidationRequest');
const toUTCTimestamp = require('../toUTCTimestamp');
const put = require('./db').put;
const requestValidationResponse = require('../requestValidationResponse');

/**
 * Inform that address was already requested and validated (star is registered)
 * @module
 * @summary reqValidation helper
 *
 * @param {Object} vr - IdentityValidationRequest
 * @param {Object} reqInfo - via `request.info`
 *
 * @returns {Object} - { existingActiveRequestTimestamp, secondsRemaining }
 */
const getRequestValidationResponse = (vr, reqInfo) => {
  // Verify arguments
  if (!vr)
    err('reqValidation.getRequestValidationResponse: IdentityValidationRequest required');
  if (
    !(vr instanceof IdentityValidationRequest) ||
    !vr.hasOwnProperty('requests') ||
    !(vr.requests instanceof Array) ||
    !vr.hasOwnProperty('validationWindow') ||
    typeof vr.validationWindow !== 'number'
  )
    err('reqValidation.getRequestValidationResponse: Invalid IdentityValidationRequest');
  if (
    !reqInfo ||
    typeof reqInfo !== 'object' ||
    !reqInfo.received ||
    isNaN(reqInfo.received)
  )
    err('reqValidation.getRequestValidationResponse: Invalid `reqInfo`');
  // Check previous requests for one which is active
  const currentReqTimestamp = toUTCTimestamp(reqInfo.received);
  // If validation request message signature was previously completed, its `activeTimestamp` will be `null`
  if (vr.isComplete())
    vr.activeTimestamp = currentReqTimestamp;
  const overallElapsed = parseInt(currentReqTimestamp) - parseInt(vr.activeTimestamp);
  let existingActiveRequest;
  // Only look for an `existingActiveRequest` last-active within the `validationWindow`
  if (!vr.isComplete() && overallElapsed < vr.validationWindow && vr.requests.length) {
    const requests = vr.requests;
    for (let i = 0; i < requests.length; i++) {
      const timestamp = toUTCTimestamp(requests[i].received);
      let secondsElapsed = parseInt(currentReqTimestamp) - parseInt(timestamp);
      // Identify `existingActiveRequest` as within last-active `validationWindow`
      if (secondsElapsed < vr.validationWindow) {
        secondsElapsed = parseInt(currentReqTimestamp) - parseInt(vr.activeTimestamp);
        existingActiveRequest = { timestamp, secondsElapsed };
        break;
      }
    }
  }
  // Determine `validationWindow` based on existing or current request
  let validationWindow;
  if (existingActiveRequest) {
    validationWindow = vr.validationWindow - existingActiveRequest.secondsElapsed;
  } else {
    validationWindow = vr.validationWindow;  // Reset `validationWindow`
    if (overallElapsed >= vr.validationWindow)
      vr.activeTimestamp = currentReqTimestamp;  // Reset `activeTimestamp`
  }
  if (!vr.isComplete())
    vr.allowBlock = true;  // Reset for new request
  // Store each request for later audits
  vr.addRequest(vr, reqInfo);
  put(vr);
  return requestValidationResponse(vr.address, vr.activeTimestamp, validationWindow);
};

module.exports = getRequestValidationResponse;

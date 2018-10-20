'use strict';
const db = require('./db');
const alreadyCompleted = require('./alreadyCompleted');
const getRequestValidationResponse = require('./getRequestValidationResponse');
const err = require('../err');
const validateBitcoinAddr = require('../validateBitcoinAddr');
const requestValidationResponse = require('../requestValidationResponse');
const IdentityValidationRequest = require('../../classes/IdentityValidationRequest');
const toUTCTimestamp = require('../toUTCTimestamp');

/**
 * Request validation for Blockchain address
 * @module
 * @summary Route helper
 *
 * @param {Object} payload - via `request.payload`
 * @param {Object} reqInfo - via `request.info`
 *
 * @returns {Object}
 * @description Returned `validationWindow` property will be a number in seconds, or `null` if validation-request has already been completed
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const reqValidation = async (payload, reqInfo) => {
  // Verify payload-and reqInfo
  if (!payload || typeof payload !== 'object')
    err('reqValidation: Invalid `payload`');
  const address = payload.address;
  if (!address || typeof address !== 'string')
    err('reqValidation: Invalid `payload.address`');
  if (!validateBitcoinAddr(address))
    err('reqValidation: Invalid Bitcoin address');
  if (!reqInfo)
    err('reqValidation: `reqInfo` is required');
  if (
    typeof reqInfo !== 'object' ||
    !reqInfo.received
  )
    err('reqValidation: Invalid `reqInfo`');
  // Fetch and check if address exists
  let reqTimestamp = toUTCTimestamp(reqInfo.received);
  let vr = await db.get(address);
  if (vr) {
    if (vr.isComplete())
      alreadyCompleted(vr);
    const reqValidationResp = getRequestValidationResponse(vr, reqInfo);
    if (reqValidationResp)
      return reqValidationResp;
  } else {
    // Address not found - create new request
    vr = new IdentityValidationRequest({ address, activeTimestamp:reqTimestamp });
  }
  vr.addRequest(vr, reqInfo);
  db.put(vr);
  return vr.isComplete() ?
    requestValidationResponse(address, vr.activeTimestamp, vr.validationWindow) :
    requestValidationResponse(address, reqTimestamp);
};

module.exports = reqValidation;
// Helpers:
module.exports.get = db.get;
module.exports.put = db.put;
module.exports.alreadyCompleted = alreadyCompleted;
module.exports.getRequestValidationResponse = getRequestValidationResponse;

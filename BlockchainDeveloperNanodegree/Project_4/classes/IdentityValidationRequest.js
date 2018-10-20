'use strict';
const consts = require('../config/consts').toJS();
const err = require('../helpers/err');
const validateBitcoinAddress = require('../helpers/validateBitcoinAddr');

/**
 * IdentityValidationRequest (container of requests [plural])
 * @class
 * @classdesc Create a validation-requests Object
 *
 * @return {Object}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
class IdentityValidationRequest {
  /**
   * @constructor
   *
   * @param {Object} requestsCfg
   */
  constructor(requestsCfg) {
    // Validate requestsCfg
    if (!requestsCfg)
      err('IdentityValidationRequest is required');
    if (!requestsCfg.address)
      err('IdentityValidationRequest requestsCfg.address is required');
    if (
      !validateBitcoinAddress(requestsCfg.address) ||
      (requestsCfg.hasOwnProperty('validationWindow') && typeof requestsCfg.validationWindow !== 'number') ||
      (requestsCfg.hasOwnProperty('requests') && !(requestsCfg.requests instanceof Array))
    ) {
      err('IdentityValidationRequest requestsCfg.address invalid');
    }
    // Set properties returned in scope --> Object
    this.address = requestsCfg.address;
    this.validationWindow = requestsCfg.validationWindow || consts.validationWindow;
    this.activeTimestamp = requestsCfg.activeTimestamp || null;
    this.requests = requestsCfg.requests || [];
    this.complete = requestsCfg.complete || [];
    this.allowBlock = requestsCfg.allowBlock || false;
  }


  /**
   * isComplete
   * @function
   * @summary Check if the current `activeTimestamp` has been completed by a signed message-signature
   *
   * @returns {boolean}
   */
  //
  isComplete() {
    return this.complete.indexOf(this.activeTimestamp) > -1;
  }


  /**
   * addRequest
   * @function
   * @summary Add a request Object to the IdentityValidationRequest.requests collection
   *
   * @param {Object} requestsObj - instance of IdentityValidationRequest class
   * @param {Object} request - an Object which must contain a `received` timestamp value
   *
   * @returns {Object} IdentityValidationRequest
   */
  //
  addRequest(requestsObj, request) {
    // Validate requestsObj
    if (!requestsObj)
      err('IdentityValidationRequest.addRequest: requestsObj is required');
    if (
      typeof requestsObj !== 'object' ||
      !requestsObj.hasOwnProperty('requests') ||
      !(requestsObj.requests instanceof Array)
    ) {
      err('IdentityValidationRequest.addRequest: requestsObj invalid');
    }
    // Validate request
    if (!request) err('IdentityValidationRequest.addRequest: request is required');
    if (
      typeof request !== 'object' ||
      Object.keys(request).length < 1 ||   // Must at least have the following property:
      !request.hasOwnProperty('received')  // Timestamp required
    ) {
      err('IdentityValidationRequest.addRequest: request invalid');
    }
    // Add request and return requestsObj
    requestsObj.requests.push(request);
    return requestsObj;
  }
}

module.exports = IdentityValidationRequest;

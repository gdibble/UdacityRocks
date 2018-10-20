'use strict';
const bitcoinMessage = require('bitcoinjs-message');
// const Message = require('bitcore-message');  // Alternative - working (also tested)
const err = require('./err');
const validateBitcoinAddr = require('./validateBitcoinAddr');
const reqValidation = require('./reqValidation');
const toUTCTimestamp = require('./toUTCTimestamp');
const requestValidationResponse = require('./requestValidationResponse');
const errMsg = 'validation request not found and must be sent first';

/**
 * Allow User Message Signature
 * @function
 * @summary Route helper
 *
 * @param {Object} payload
 *
 * @returns {Object}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const validateMessageSignature = async (payload, reqInfo) => {
  // Verify payload-and reqInfo
  if (!payload || typeof payload !== 'object')
    err('validateMessageSignature: Invalid `payload`');
  const address = payload.address;
  if (!address || typeof address !== 'string')
    err('validateMessageSignature: Invalid `payload.address`');
  if (!validateBitcoinAddr(address))
    err('validateMessageSignature: Invalid Bitcoin address', null, true);
  const signature = payload.signature;
  if (!signature || typeof signature !== 'string')
    err('validateMessageSignature: Invalid `payload.signature`');
  if (!reqInfo || typeof reqInfo !== 'object' || !reqInfo.received)
    err('validateMessageSignature: Invalid `reqInfo`');
  // Response helper
  const output = (registerStar, requestValidationResponse, messageSignature) => {
    return { registerStar, status:Object.assign(requestValidationResponse, { messageSignature }) };
  };
  // Fetch IdentityValidationRequest
  let vr = await reqValidation.get(address);
  if (vr) {
    if (vr.isComplete()) {
      reqValidation.alreadyCompleted(vr);
      return output(true, requestValidationResponse(vr.address, vr.activeTimestamp), 'valid');
    } else {
      const reqValidationResp = reqValidation.getRequestValidationResponse(vr, reqInfo);
      const response = output(true, reqValidationResp || requestValidationResponse(vr.address, toUTCTimestamp(reqInfo.received)), 'valid');
      let isMessageValid;
      try {
        isMessageValid = bitcoinMessage.verify(response.status.message, address, payload.signature);
        // isMessageValid = Message(response.status.message).verify(address, payload.signature);  // Another module (alternative)
      } catch (e) {
        err('validateMessageSignature: Message validation', e, true);
      }
      // Verify signature
      if (isMessageValid) {
        if (response.registerStar) {
          vr.complete.push(vr.activeTimestamp);
          reqValidation.put(vr);
        }
        return response;
      } else {
        return output(false, requestValidationResponse(vr.address, toUTCTimestamp(reqInfo.received)), 'invalid');
      }
    }
  } else {
    return output(false, { address, error:errMsg }, 'invalid');
  }
};

module.exports = validateMessageSignature;
module.exports.errMsg = errMsg;

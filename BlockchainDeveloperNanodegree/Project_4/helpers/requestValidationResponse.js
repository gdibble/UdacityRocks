'use strict';
const consts = require('../config/consts').toJS();
const validateBitcoinAddr = require('./validateBitcoinAddr');
const err = require('./err');

/**
 * Validate a Bitcoin address
 * @module
 *
 * @param {string} address - Bitcoin address
 * @param {string} requestTimestamp - UTC timestamp in seconds
 * @param {number=} validationWindow - seconds remaining; defaults to `consts.validationWindow`
 *
 * @returns {Object}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const requestValidationResponse = (address, requestTimestamp, validationWindow = consts.validationWindow) => {
  if (
    !address ||
    !validateBitcoinAddr(address) ||
    !requestTimestamp ||
    !/^(\d{10}|\d{13})$/.test(requestTimestamp) ||
    (validationWindow !== null && typeof validationWindow !== 'number') ||
    (typeof validationWindow === 'number' && (validationWindow > consts.validationWindow || validationWindow < 1))
  )
    err('requestValidationResponse: Invalid argument', null, true);
  const message = [ address, requestTimestamp, consts.namespace ].join(':');
  return { address, requestTimestamp, message, validationWindow };
};

module.exports = requestValidationResponse;

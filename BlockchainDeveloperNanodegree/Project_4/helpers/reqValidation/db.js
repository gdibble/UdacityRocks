'use strict';
const level = require('level');
const db = level('./data_validations');
const err = require('../err');
const IdentityValidationRequest = require('../../classes/IdentityValidationRequest');
const validateBitcoinAddr = require('../validateBitcoinAddr');

/**
 * Fetch validation request from database
 * @module
 * @summary reqValidation helper
 *
 * @param {string} address
 *
 * @returns {Object}
 */
const get = async (address) => {
  try {
    let vr = await db.get(address);
    if (vr)
      return new IdentityValidationRequest(JSON.parse(vr));
  } catch (e) {  // `reject` throws error, goes here:
    err('reqValidation.get: DB error', e, true);
  }
};

/**
 * Fetch validation request from database
 * @module reqValidation helper
 *
 * @param {string} address
 *
 * @returns {Object}
 */
const put = async (vr) => {
  if (!vr)
    err('reqValidation.put: IdentityValidationRequest required');
  if (typeof vr !== 'object' || !vr.hasOwnProperty('address'))
    err('reqValidation.put: Invalid IdentityValidationRequest');
  if (
    !validateBitcoinAddr(vr.address) ||
    !vr.address ||
    typeof vr.address !== 'string'
  )
    err('reqValidation.put: Invalid Bitcoin address');
  try {
    return db.put(vr.address, JSON.stringify(vr));
  } catch (e) {  // `reject` throws error, goes here:
    err('reqValidation.put: DB error', e);
  }
};

module.exports = { get, put };

'use strict';
const err = require('../err');

/**
 * Inform that address was already requested and validated (star is registered)
 * @module
 * @summary reqValidation helper
 *
 * @param {Object} vr
 *
 */
const alreadyCompleted = (vr) => {
  if (!vr)
    err('reqValidation.alreadyCompleted: IdentityValidationRequest required');
  if (
    typeof vr !== 'object' ||
    !vr.hasOwnProperty('requests') ||
    !(vr.requests instanceof Array) ||
    !vr.hasOwnProperty('address') ||
    typeof vr.address !== 'string'
  )
    err('reqValidation.alreadyCompleted: Invalid IdentityValidationRequest');
  // Simply log error (do not throw)
  err('reqValidationStar registration already completed for ' + vr.address + ': ' + vr.activeTimestamp, null, true);
};

module.exports = alreadyCompleted;

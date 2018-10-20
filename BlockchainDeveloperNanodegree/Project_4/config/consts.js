'use strict';

/**
 * Configuration of Constants
 *
 * @returns {Object}
 */
const constsConfig = {
  namespace: 'starRegistry',
  validationWindow: Math.floor(1*60*5)  // 5 minutes in seconds
};

module.exports = require('immutable').Map(constsConfig);

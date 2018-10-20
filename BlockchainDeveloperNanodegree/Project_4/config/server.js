'use strict';

/**
 * Configuration of API Server settings
 *
 * @returns {Object}
 */

const serverConfig = {
  host: 'localhost',
  port: 8000
};

module.exports = require('immutable').Map(serverConfig);

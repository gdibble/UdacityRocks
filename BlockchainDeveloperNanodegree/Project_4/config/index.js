'use strict';

/**
 * Configuration aggregator
 *
 * @returns {Object}
 */
const server = require('./server');
const routes = require('./routes');

const deepConfig = {
  server,
  routes
};

module.exports = require('immutable').Map(deepConfig);

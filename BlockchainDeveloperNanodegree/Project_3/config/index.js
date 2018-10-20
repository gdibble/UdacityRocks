'use strict';

/**
 * Configuration aggregator
 *
 * @returns {Object} configs
 */
const server = require('./server');
const routes = require('./routes');
const dataModel = require('./dataModel.json');

const deepConfig = {
	server,
	routes,
  dataModel
};

module.exports = deepConfig;

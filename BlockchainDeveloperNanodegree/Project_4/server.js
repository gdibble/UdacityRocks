'use strict';

/**
 * Star Registry Blockchain API server
 *
 * @requires hapi
 */
const Hapi = require('hapi');
const config = require('./config');
const err = require('./helpers/err');

// Setup Star Registry Blockchain API server
const server = Hapi.server(config.toJS().server);

// Setup all routes
Object.keys(config.toJS().routes).forEach((routeName) => {
  server.route(config.toJS().routes[routeName]);
});

// Initiate API server
async function start() {
  try {
    await server.start();
  } catch (e) {
    err('API Server error', e, true, true);
  }
  console.log('⭐ Star Registry API Nominal\n⭐ Started ' + new Date().toUTCString() + '\n⭐', server.info.uri, '\n');
}
start();  // <---- RUN IT!

module.exports = server;  // Export for unit testing server startup & functionality

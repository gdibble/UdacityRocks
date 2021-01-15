'use strict';

/**
 * Private Blockchain API server
 *
 * @requires hapi
 */
const Hapi = require('@hapi/hapi');
const config = require('./config');

// Setup Private Blockchain API server
const server = Hapi.server(config.server);

// Setup all routes
Object.keys(config.routes).forEach((routeName) => {
  server.route(config.routes[routeName]);
});

// Initiate API server
async function start() {
    try {
      await server.start();
    } catch (err) {
        console.log('API Server error\n', err);
        process.exit(1);
    }
    console.log('Private Blockchain API Server online\n', server.info.uri, '\n');
};
start();  // <----

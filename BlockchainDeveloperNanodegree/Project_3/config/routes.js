'use strict';
const Boom = require('boom');
const Blockchain = require('../privateBlockchain');
const bc = new Blockchain();

/**
 * Configuration of API Routes
 * @description Routes mimic `privateBlockchain` Class API (except console-log output test methods)
 *
 * @returns {Object} config
 *
 * @requires boom
 */
let routesConfig = {

  /**
   * Current height of the Blockchain
   * @method
   *
   * @returns {number}
   */
  getBlockHeight: {
    method: 'GET',
    path: '/block/height',
    handler: async (request) => {
      try {
        return await bc.getBlockHeight();
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  /**
   * Return all blocks from the Blockchain
   * @method
   *
   * @param {Boolean=} reverse - query-parameter (true||false) optional
   *
   * @returns {Array} Blockchain
   */
  getBlocks: {
    method: 'GET',
    path: '/block/chain',
    handler: async (request) => {
      try {
        let reverse = request.query.reverse === 'true';
        return await bc.getBlocks(reverse);
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },



  /**
   * Get a block by passing the desired height
   * @method
   *
   * @param {number} block-height
   *
   * @returns {Object} block
   */
  getBlock: {
    method: 'GET',
    path: '/block/{height}',
    handler: async (request) => {
      try {
        return  await bc.getBlock(parseInt(request.params.height));
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  /**
   * Push a block onto the chain
   * @method
   *
   * @param {Object} block
   * @param {Boolean=} overrideHeight - query-parameter (true||false) optional
   *
   * @returns {object} new block
   */
  addBlock: {
    method: 'POST',
    path: '/block',
    handler: async (request) => {
      try {
        let overrideHeight = request.query.overrideHeight === 'true';
        return await bc.addBlock(request.payload, overrideHeight);
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  /**
   * Validate a block
   * @method
   *
   * @param {Object} block sent as request-payload
   *
   * @returns {Boolean} validity
   */
  validateBlock: {
    method: 'GET',
    path: '/block/validate/{height}',
    handler: async (request) => {
      try {
        return await bc.validateBlock(parseInt(request.params.height));
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  /**
   * Validate full Blockchain
   * @method
   *
   * @returns {Boolean} validity
   */
  validateChain: {
    method: 'GET',
    path: '/block/validate/chain',
    handler: async (request) => {
      try {
        return await bc.validateChain();
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  }
};

module.exports = routesConfig;

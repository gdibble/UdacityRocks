'use strict';
const Boom = require('boom');
const bc = new (require('../classes/StarRegistryBlockchain'))();
const reqValidation = require('../helpers/reqValidation');
const validateMessageSignature = require('../helpers/validateMessageSignature');

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
   * Root info
   * @method
   *
   * @returns {number}
   */
  rootInfo: {
    method: 'GET',
    path: '/',
    handler: () => {
      return '⭐ Star Registry API Nominal ⭐ Presently it is ' + new Date().toUTCString() + ' ⭐';
    }
  },

  /**
   * Current height of the Blockchain
   * @method
   *
   * @returns {number}
   */
  getBlockHeight: {
    method: 'GET',
    path: '/block/height',
    handler: async (/*request*/) => {
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
        return Boom.boomify(new Error(err), { statusCode:err.indexOf('NotFoundError') > -1 ? 404 : 400 });
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
    handler: async (/*request*/) => {
      try {
        return await bc.validateChain();
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  // STAR SEARCH BY KEY:

  getStars: {
    method: 'GET',
    path: '/stars/{byKeyValue}',
    handler: async (request) => {
      const byKeyValue = request.params.byKeyValue;
      if (byKeyValue && byKeyValue.indexOf(':') > -1) {
        const key = byKeyValue.split(':')[0];
        const value = byKeyValue.split(':')[1];
        try {
          const resp = await bc.getStars(key, value);
          return resp || Boom.boomify(new Error('/stars/' + key + ':' + value + ' did not return a Block'), { statusCode:404 });
        } catch (err) {
          return Boom.boomify(new Error(err), { statusCode:400 });
        }
      } else {
        return Boom.boomify(new Error('/stars/{byKeyValue} required in the form of key:value'), { statusCode:422 });
      }
    }
  },

  // STAR REGISTRY ENDPOINTS:

  /**
   * Request validation for Blockchain address
   * @method
   *
   * @returns {Object}
   */
  reqValidation: {
    method: 'POST',
    path: '/requestValidation',
    handler: async (request) => {
      try {
        return await reqValidation(request.payload, request.info);
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  },

  /**
   * Request validation for Blockchain address
   * @method
   *
   * @returns {Object}
   */
  validateMessageSignature: {
    method: 'POST',
    path: '/message-signature/validate',
    handler: async (request) => {
      try {
        return await validateMessageSignature(request.payload, request.info);
      } catch (err) {
        return Boom.boomify(new Error(err), { statusCode:400 });
      }
    }
  }
};

module.exports = require('immutable').Map(routesConfig);

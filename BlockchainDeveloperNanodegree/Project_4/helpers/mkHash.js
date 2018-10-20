'use strict';
const sha256 = require('crypto-js/sha256');
const err = require('./err');

/**
 * Create a block hash
 * @module
 *
 * @paran {Object} block
 *
 * @returns {string} Unique hash derived from block data
 *
 * @requires sha256
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const mkHash = (block) => {
  if (!(block instanceof Object) || !Object.keys(block).length)
    err('mkHash: Invalid block');
  else {
    block.hash = '';  // Reset existing `hash` for safety
    return sha256(JSON.stringify(block)).toString();  // Return hash for block
  }
};

module.exports = mkHash;

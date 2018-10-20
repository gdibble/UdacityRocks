const sha256 = require('crypto-js/sha256');

/**
 * Create a block hash
 * @module
 *
 * @paran {Object} block
 *
 * @returns {string} Unique hash derived from block data
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
const mkHash = (block) => {
  if (block instanceof Object) {
    block.hash = '';  // Reset existing `hash` for safety
    return sha256(JSON.stringify(block)).toString();  // Return hash for block
  } else {
    throw(new Error('mkHash input error: `block` must be an Object'));
  }
};


module.exports = mkHash;

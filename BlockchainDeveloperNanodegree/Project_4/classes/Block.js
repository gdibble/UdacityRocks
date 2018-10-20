'use strict';
const block_dataModel = require('../config/dataModels/block.json');
const now = require('../helpers/now');
const mkHash = require('../helpers/mkHash');

/**
 * Block
 * @class
 * @classdesc Create a block based on the data-model
 *
 * @return {Object}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
class Block {
  /**
   * @constructor
   *
   * @param {Object={}} blockCfg
   */
  constructor(blockCfg = {}) {
    Object.keys(block_dataModel).reverse().forEach((key) => {
      if (key === 'time') {
        this.time = blockCfg.time || now();
      } else if (key !== 'hash') {
        this[key] = blockCfg[key] || block_dataModel[key];
      }
    });
    this.hash = mkHash(this);  // Set last
  }
}

module.exports = Block;

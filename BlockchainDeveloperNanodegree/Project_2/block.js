const dataModel = require('./dataModel.json');
const mkHash = require('./helpers/mkHash');
const now = require('./helpers/now');


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
    Object.keys(dataModel).reverse().forEach((key) => {
      if (key === 'time') {
        this.time = blockCfg.time || now();
      } else if (key !== 'hash') {
        this[key] = blockCfg[key] || dataModel[key];
      }
    });
    this.hash = mkHash(this);  // Set last
  }
}

module.exports = Block;

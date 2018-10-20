'use strict';
const blockBody_dataModel = require('../config/dataModels/blockBody.json');

/**
 * BlockBody
 * @class
 * @classdesc Create a block.body Object based on the data-model
 *
 * @return {Object}
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
class BlockBody {
  /**
   * @constructor
   *
   * @param {Object={}} blockBodyCfg
   */
  constructor(blockBodyCfg = {}) {
    Object.keys(blockBody_dataModel).reverse().forEach((key) => {
      this[key] = blockBodyCfg[key] || blockBody_dataModel[key];
    });
  }
}

module.exports = BlockBody;

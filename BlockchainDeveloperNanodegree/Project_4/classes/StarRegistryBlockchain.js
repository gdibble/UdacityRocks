'use strict';
const level = require('level');
const dbBC = level('./data_blockchain');
const Block = require('./Block');
const BlockBody = require('./BlockBody');
const err = require('../helpers/err');
const now = require('../helpers/now');
const mkHash = require('../helpers/mkHash');
const dbVR = require('../helpers/reqValidation/db');
// Internal helpers:
const sortByHeight = (a, b) => {
  return a.height === b.height ? 0 : a.height > b.height ? 1 : -1;  // Helper
};
String.prototype.hexEncode = function () {
  let hex, i;
  let result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }
  return result;
};
String.prototype.hexDecode = function () {
  let i;
  let hexes = this.match(/.{1,4}/g) || [];
  let back = '';
  for (i = 0; i<hexes.length; i++) {
    back += String.fromCharCode(parseInt(hexes[i], 16));
  }
  return back;
};

/**
 * Star Registry Blockchain v4
 * @class
 * @classdesc Utilities for working with this Blockchain
 *
 * @tutorial Documentation: README.md
 * @see JSDoc notation throughout
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
class StarRegistryBlockchain {
  /**
   * Blockchain
   * @constructor
   *
   * @param {Object=} genesisBlock
   */
  constructor(genesisBlock = { body:new BlockBody()}) {
    (async () => {
      // Check Blockchain height - create Genesis block if new-chain (height=0)
      let blockHeight = await this.getBlockHeight();
      if (blockHeight < 0) {
        let newBlock = new Block(genesisBlock);
        console.log('\n\n Adding Genesis block:',JSON.stringify(newBlock));
        this.addBlock(newBlock);
      }
    })();
  }

  /**
   * getBlockHeight
   * @function
   * @summary Current height of the Blockchain
   *
   * @returns {number}
   */
  async getBlockHeight() {
    let height = 0;
    await new Promise((resolve, reject) => dbBC.createReadStream().on('data', (/*block*/) => {
      height++;
    }).on('error', (readError) => {
      reject();
      return console.log('\n\n getBlockHeight DB read error:', readError);
    }).on('close', () => {
      resolve();
    }));
    let blockHeight = height - 1;
    return blockHeight;
  }

  /**
   * listBlocks
   * @function
   * @summary List all blocks on the chain
   */
  async listBlocks() {
    const chain = await this.getBlocks();
    const height = chain.length;
    console.log('\n\n Blockchain height:', height, '\n', chain);
  }

  /**
   * getBlocks
   * @function
   * @summary Return all blocks from the Blockchain
   *
   * @param (Boolean=) reverse - Switch from ascending (Default/false) to descending order (true)
   *
   * @returns {Array}
   */
  async getBlocks(reverse = false) {
    let chain = [];
    await new Promise((resolve, reject) => dbBC.createValueStream().on('data', (block) => {
      block = JSON.parse(block);
      block.body.star.storyDecoded = block.body.star.story.hexDecode();
      chain.push(block);
    }).on('error', (readError) => {
      err('\n\n getBlocks: DB read error:', readError);
      reject(false);
    }).on('close', () => {
      chain.sort(sortByHeight);
      if (reverse) chain.reverse();
      resolve(chain);
    }));
    return chain;
  }

  /**
   * getBlock
   * @function
   * @summary Get a block on the Blockchain
   *
   * @param {number=} blockHeight
   *
   * @returns {Object}
   */
  async getBlock(blockHeight) {
    try {
      blockHeight = typeof blockHeight === 'number' ?
        blockHeight :
        await this.getBlockHeight();  // Fallback to Blockchain height
      let block = await dbBC.get(blockHeight);
      block = JSON.parse(block);
      block.body.star.storyDecoded = block.body.star.story.hexDecode();
      return block;
    } catch (e) {  // `reject` throws error, goes here:
      err('getBlock: DB error', e);
    }
  }

  /**
   * getStars
   * @function
   * @summary Get a block on the Blockchain by searching specific key-values
   *
   * @param {key} Object-key to search against
   * @param {value} value to match with key
   *
   * @returns {any} Collection or Object-singleton
   */
  async getStars(key, value) {
    let blocks = [];
    await new Promise((resolve, reject) => dbBC.createValueStream().on('data', (block) => {
      block = JSON.parse(block);
      if (
        key &&
        !block.hasOwnProperty(key) &&
        !block.body.hasOwnProperty(key) &&
        !block.body.star.hasOwnProperty(key)
      ) {
        let msg = 'getStars: "' + key + '" key not found in Block';
        err(msg, null, true);
        reject(msg);
      }
      if (
        key &&
        block[key] === value ||
        block.body[key] === value ||
        block.body.star[key] === value
      ) {
        block.body.star.storyDecoded = block.body.star.story.hexDecode();
        blocks.push(block);
      }
    }).on('error', (readError) => {
      let msg = 'getStars: DB read error: ' + readError;
      err('\n\n ' + msg);
      reject(msg);
    }).on('close', () => {
      blocks.sort(sortByHeight);
      resolve(blocks);
    }));
    // Object-singleton or Collection
    if (key && key === 'hash')
      return blocks[0];
    else
      return blocks;
  }

  /**
   * getTest
   * @function
   * @summary Verifies `getBlock` fn with cli-output
   *
   * @param {number=} blockHeight
   */
  async getTest(blockHeight) {
    try {
      blockHeight = typeof blockHeight === 'number' ?
        blockHeight :
        await this.getBlockHeight();  // Fallback to Blockchain height
      const block = await this.getBlock(blockHeight);
      console.log('\n\n Block #' + blockHeight + ':', JSON.stringify(block));
    } catch (e) {  // `reject` throws error, goes here:
      console.log('\n\n getTest: DB error', e);
    }

  }

  /**
   * addBlock
   * @function
   * @summary Push a block onto the chain
   *
   * @param {Object=} newBlockBody
   * @param {Boolean=} overrideHeight - Replaces block's `height` propery with current Blockchain height
   */
  async addBlock(newBlockBody = new BlockBody(), overrideHeight = false) {
    const blockHeight = await this.getBlockHeight();
    const newBlockHeight = blockHeight + 1;
    // Error checking
    if (
      !newBlockBody ||
      typeof newBlockBody !== 'object' ||
      !Object.keys(newBlockBody)
    )
      err('addBlock: Invalid newBlockBody');
    if (
      !overrideHeight &&
      newBlockBody.height &&
      newBlockBody.height !== blockHeight
    )
      err('addBlock: Invalid block `height`: property value inequal to current Blockchain height of ' + newBlockHeight);
    if (
      newBlockBody.star &&
      newBlockBody.star.story &&
      Buffer.from(newBlockBody.star.story).length > 250
    )
      err('addBlock: `story` property value is too long', null, true);
    const vr = blockHeight > -1 ? await dbVR.get(newBlockBody.address) : void(0);
    if (blockHeight > -1 && (!vr || !vr.isComplete() || !vr.allowBlock)) {
      err('addBlock: Identity Validation Request must first be completed');
    } else {
      // Create new block from passed block or blockCfg
      let newBlock = new Block({ body:new BlockBody(newBlockBody) });
      newBlock.body.star.story = newBlock.body.star.story.hexEncode();
      // Set new block data
      newBlock.height = newBlockHeight;
      newBlock.time = now();
      if (blockHeight > -1) {
        let previousBlock = await this.getBlock(blockHeight);
        newBlock.previousBlockHash = previousBlock.hash;
      }
      if (newBlock.body.star.storyDecoded)  // Do not persist `storyDecoded` or use in hash generation
        delete newBlock.body.star.storyDecoded;
      newBlock.hash = mkHash(newBlock);
      // Update validation request to disallow further block creation - `vr` does not exist for Genesis Block creation
      if (vr) {
        vr.allowBlock = false;
        dbVR.put(vr);
      }
      // Add new block to the chain as string
      dbBC.put(newBlock.height, JSON.stringify(newBlock));
      return newBlock;
    }
  }

  /**
   * validateBlock
   * @function
   * @summary Validate a block
   *
   * @param {number=} blockHeight
   * @param {boolean=} suppressValidLog - Passing true does not log in the console
   */
  async validateBlock(blockHeight, suppressValidLog = false) {
    blockHeight = typeof blockHeight === 'number' ?
      blockHeight :
      await this.getBlockHeight();  // Fallback to Blockchain height
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
    delete block.body.star.storyDecoded;  // Remove per mkHash
    block.hash = '';  // Remove block hash to test block integrity
    let validBlockHash = mkHash(block);  // Generate block hash
    if (blockHash === validBlockHash) {  // Compare
      if (!suppressValidLog) console.log('\n\n Block #' + blockHeight + ' has valid hash :)');
      return true;
    } else {
      console.log('\n\n Block #' + blockHeight + ' invalid hash :(\n' + blockHash + '<>' + validBlockHash);
      return false;
    }
  }


  /**
   * validateChain
   * @function
   * @summary Validate full Blockchain
   *
   * @returns {boolean}
   */
  //
  async validateChain() {
    let height = await this.getBlockHeight() + 1;
    let errorLog = [];
    for (let i = 0; i < height; i++) {
      // Validate block
      if (await !this.validateBlock(i, true)) errorLog.push(i);
      // Compare hashes of block and its predecessor
      let block  = await this.getBlock(i);  // Get block from key-value pairs
      let blockHash = block.hash;
      let nextHeight = i + 1;
      if (nextHeight < height) {  // Ensure not at last block in the chain
        let nextBlock = await this.getBlock(nextHeight);  // Get following block from key-value pairs
        if (blockHash !== nextBlock.previousBlockHash) {
          errorLog.push(i);
        }
      }
    }
    if (errorLog.length > 0) {
      console.log('\n\n Block errors found: ' + errorLog.length + ' :(');
      console.log('Blocks: ' + errorLog);
      return false;  // Invalid
    } else {
      console.log('\n\n Blockchain integrity nominal :)');
      return true;  // Valid
    }
  }
}

module.exports = StarRegistryBlockchain;
module.exports.Block = Block;
module.exports.BlockBody = BlockBody;

'use strict';
const level = require('level');
const Block = require('./block');
const now = require('./helpers/now');
const mkHash = require('./helpers/mkHash');
const chainDb = './chaindata';
const db = level(chainDb);

/**
 * Private Blockchain v3
 * @class
 * @classdesc Utilities for working with this private Blockchain
 *
 * @tutorial Documentation: README.md
 * @see JSDoc notation throughout
 *
 * @author Gabriel Dibble <gdibble@gmail.com>
 */
class PrivateBlockchain {
  /**
   * Blockchain
   * @constructor
   *
   * @param {Object=} genesisBlock
   */
  constructor(genesisBlock = { body:'Udacity rocks!' }) {
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
    await new Promise((resolve, reject) => db.createReadStream().on('data', (/*block*/) => {
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
    let chain = await this.getBlocks();
    let height = chain.length;
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
    await new Promise((resolve, reject) => db.createValueStream().on('data', (block) => {
      chain.push(JSON.parse(block));
    }).on('error', (readError) => {
      reject(false);
      return console.log('\n\n getBlocks DB read error:', readError);
    }).on('close', () => {
      chain.sort((a, b) => {
        return a.height === b.height ? 0 : a.height > b.height ? 1 : -1;
      });
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
      blockHeight = typeof blockHeight === 'number' ? blockHeight :
                    await this.getBlockHeight();  // Fallback to Blockchain height
      const block = await db.get(blockHeight);
      return JSON.parse(block);
    } catch (e) {  // `reject` throws error, goes here:
      console.log('\n\n getBlock DB error', e);
    }
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
      blockHeight = typeof blockHeight === 'number' ? blockHeight :
                    await this.getBlockHeight();  // Fallback to Blockchain height
      const block = await this.getBlock(blockHeight);
      console.log('\n\n Block #' + blockHeight + ':', JSON.stringify(block));
    } catch (e) {  // `reject` throws error, goes here:
      console.log('\n\n getTest DB error', e);
    }

  }

  /**
   * addBlock
   * @function
   * @summary Push a block onto the chain
   *
   * @param {Object=} newBlock
   * @param {Boolean=} overrideHeight - Replaces block's `height` propery with current Blockchain height
   */
  async addBlock(newBlock = new Block(), overrideHeight = false) {
    newBlock = new Block(newBlock);  // Create new block from passed block or blockCfg
    let blockHeight = await this.getBlockHeight();
    let newBlockHeight = blockHeight + 1;
    // Error checking
    if (!newBlock.body.trim())
      throw new Error('Invalid block `body`: property value must contain content');
    if (!overrideHeight && newBlock.height && newBlock.height !== blockHeight)
      throw new Error('Invalid block `height`: property value inequal to current Blockchain height of ' + newBlockHeight);
    // Set new block data
    newBlock.height = newBlockHeight;
    newBlock.time = now();
    if (blockHeight > -1) {
      let previousBlock = await this.getBlock(blockHeight);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    newBlock.hash = mkHash(newBlock);
    // Add new block to the chain as string
    db.put(newBlock.height, JSON.stringify(newBlock));
    return newBlock;
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
    blockHeight = typeof blockHeight === 'number' ? blockHeight :
                  await this.getBlockHeight();  // Fallback to Blockchain height
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;
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
    for (var i = 0; i < height; i++) {
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

module.exports = PrivateBlockchain;
module.exports.Block = Block;

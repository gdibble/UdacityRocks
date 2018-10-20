/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const StarRegistryBlockchain = require('../../classes/StarRegistryBlockchain');
const blockchain = new StarRegistryBlockchain();
const testnetAddress = '14akRYnbByRqFQjvtnKV3anAs7rUHHSAgd';

/**
 * StarRegistryBlockchain class unit test
 */
describe('classes/StarRegistryBlockchain', () => {

  it('should return an instance of the StarRegistryBlockchain class', (done) => {
    expect(blockchain instanceof StarRegistryBlockchain).to.equal(true);
    done();
  });

  it('getBlockHeight [fn] should return a Number', async () => {
    const blockHeight = await blockchain.getBlockHeight();
    expect(blockHeight).to.not.throw;
    expect(blockHeight).to.be.a('number');
  });

  it('getBlocks [fn] should return an Array', async () => {
    const blocks = await blockchain.getBlocks();
    expect(blocks).to.not.throw;
    expect(blocks).to.be.an('array');
  });

  it('getBlock [fn] should return an Object', async () => {
    const block = await blockchain.getBlock();
    expect(block).to.not.throw;
    expect(block).to.be.an('object');
  });

  it('getStars [fn] should return an Array when searching by `ra`', async () => {
    const blocks = await blockchain.getStars('ra', '');
    expect(blocks).to.not.throw;
    expect(blocks).to.be.an('array');
  });

  it('getStars [fn] should return an Array when searching by `address`', async () => {
    const blocks = await blockchain.getStars('address', '');
    expect(blocks).to.not.throw;
    expect(blocks).to.be.an('array');
  });

  it('getStars [fn] should return an Object when searching by `hash`', async () => {
    const genesisBlock = await blockchain.getBlock();
    const block = await blockchain.getStars('hash', genesisBlock.hash);
    expect(block).to.not.throw;
    expect(block).to.be.an('object');
  });

  it('getStars [fn] should throw an  error when searching by `invalidKeyName`', async () => {
    expect(() => blockchain.getStars('invalidKeyName', '')).to.throw;
  });

  it('validateBlock [fn] should return a Boolean', async () => {
    const validation = await blockchain.validateBlock(0);
    expect(validation).to.not.throw;
    expect(validation).to.a('boolean');
  });

  it('validateChain [fn] should return a Boolean', async () => {
    const validation = await blockchain.validateChain(0);
    expect(validation).to.not.throw;
    expect(validation).to.a('boolean');
  });

  it('addBlock [fn] should throw an error for an incomplete Identity Validation Request', async () => {
    expect(() => blockchain.addBlock({ address:testnetAddress.slice(0, -1) })).to.throw;  // Change `testnetAddress`
  });

  it('addBlock [fn] should return an Object', async () => {
    const block = await blockchain.addBlock({ address:testnetAddress });
    expect(block).to.not.throw;
    expect(block).to.be.an('object');
  });

});

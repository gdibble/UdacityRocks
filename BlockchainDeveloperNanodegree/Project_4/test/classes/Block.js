/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const block_dataModel = require('../../config/dataModels/block.json');
const keys = Object.keys(block_dataModel);
const Block = require('../../classes/Block');
const block = new Block();

/**
 * Block class unit test
 */
describe('classes/Block', () => {

  it('should return an instance of the Block class', (done) => {
    expect(block instanceof Block).to.equal(true);
    done();
  });

  it('should return an Object with all of the keys/props of the Block dataModel', (done) => {
    for (let i = 0; i < keys.length-1; i++) {
      expect(block.hasOwnProperty(keys[i])).to.equal(true);
    }
    done();
  });

  it('should return an Object with all the value-types matching the Block dataModel', (done) => {
    for (let i = 0; i < keys.length-1; i++) {
      expect(typeof block[keys[i]]).to.equal(typeof block_dataModel[keys[i]]);
    }
    done();
  });

});

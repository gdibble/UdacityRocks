/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const blockBody_dataModel = require('../../config/dataModels/blockBody.json');
const keys = Object.keys(blockBody_dataModel);
const BlockBody = require('../../classes/BlockBody');
const blockBody = new BlockBody();

/**
 * BlockBody class unit test
 */
describe('classes/BlockBody', () => {

  it('should return an instance of the BlockBody class', (done) => {
    expect(blockBody instanceof BlockBody).to.equal(true);
    done();
  });

  it('should return an Object with all the keys/values of the BlockBody dataModel', (done) => {
    for (let i = 0; i < keys.length-1; i++) {
      expect(blockBody.hasOwnProperty(keys[i])).to.equal(true);
    }
    done();
  });

  it('should return an Object with all the keys/values of the BlockBody dataModel', (done) => {
    for (let i = 0; i < keys.length-1; i++) {
      expect(typeof blockBody[keys[i]]).to.equal(typeof blockBody_dataModel[keys[i]]);
    }
    done();
  });

});

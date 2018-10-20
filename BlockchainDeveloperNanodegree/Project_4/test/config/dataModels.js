/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const block_dataModel = require('../../config/dataModels/block');
const blockBody_dataModel = require('../../config/dataModels/blockBody');

/**
 * dataModels/* config unit test
 */
describe('config/dataModels/*', () => {

  it('dataModels/block should be an instance of Object', (done) => {
    expect(block_dataModel instanceof Object).to.equal(true);
    done();
  });

  it('dataModels/block.body should be an instance of Object', (done) => {
    expect(block_dataModel.body instanceof Object).to.equal(true);
    done();
  });

  it('dataModels/blockBody should be an instance of Object', (done) => {
    expect(blockBody_dataModel instanceof Object).to.equal(true);
    done();
  });

});

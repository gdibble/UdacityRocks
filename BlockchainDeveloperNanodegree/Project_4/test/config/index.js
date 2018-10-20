/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const indexOrig = require('../../config/index');
const index = require('../../config/index');

/**
 * index config unit test
 */
describe('config/index', () => {

  it('should return an immutable Object', (done) => {
    index.server = 'changed';
    index.routes = 'changed';
    expect(index.server).to.equal(indexOrig.server);
    expect(index.routes).to.equal(indexOrig.routes);
    done();
  });

});

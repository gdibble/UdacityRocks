/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const err = require('../../helpers/err');

/**
 * err helper unit test
 */
describe('helpers/err', () => {

  it('should throw an error', (done) => {
    expect(() => err()).to.throw;
    done();
  });

  it('should not throw an error', (done) => {
    expect(() => err('Error', 'detail', true)).to.not.throw;
    done();
  });

});

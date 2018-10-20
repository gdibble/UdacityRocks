/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const mkHash = require('../../helpers/mkHash');
const Block = require('../../classes/Block');

/**
 * mkHash helper unit test
 */
describe('helpers/mkHash', () => {

  it('should throw an error for invalid block argument', (done) => {
    expect(() => mkHash()).to.throw;
    expect(() => mkHash({})).to.throw;
    done();
  });

  it('should return a valid response Object for valid arguments', (done) => {
    expect(mkHash(new Block())).to.exist;
    done();
  });

});

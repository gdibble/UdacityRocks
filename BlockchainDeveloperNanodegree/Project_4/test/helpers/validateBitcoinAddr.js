/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const validateBitcoinAddr = require('../../helpers/validateBitcoinAddr');

/**
 * validateBitcoinAddr helper unit test
 */
describe('helpers/validateBitcoinAddr', () => {

  it('should return `false` for no input', (done) => {
    expect(validateBitcoinAddr()).to.equal(false);
    done();
  });

  it('should return `false` for an invalid Bitcoin address', (done) => {
    expect(validateBitcoinAddr('9MtwdgMoYfMZ9FScpyL55cfdJukTzZkpJf')).to.equal(false);  // Invalid prefix
    done();
  });

  it('should return `true` for an valid Legacy Bitcoin address', (done) => {
    expect(validateBitcoinAddr('14akRYnbByRqFQjvtnKV3anAs7rUHHSAgd')).to.equal(true);
    done();
  });

  it('should return `true` for an valid TestNet Bitcoin address', (done) => {
    expect(validateBitcoinAddr('2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p')).to.equal(true);
    done();
  });

  it('should return `true` for an valid Bech32 Bitcoin address', (done) => {
    expect(validateBitcoinAddr('bc1q83dtrw9me5ym7tx3cy6g27sf0gnq4s9dvraax8')).to.equal(true);  // Bech32 validity
    done();
  });

});

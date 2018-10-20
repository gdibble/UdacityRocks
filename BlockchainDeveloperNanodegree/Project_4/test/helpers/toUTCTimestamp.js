/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const toUTCTimestamp = require('../../helpers/toUTCTimestamp');
const validSeconds = '1539230582';
const validMilliseconds = '1539230582269';

/**
 * toUTCTimestamp helper unit test
 */
describe('helpers/toUTCTimestamp', () => {

  it('should throw an error from no input', (done) => {
    expect(() => toUTCTimestamp()).to.throw;
    expect(() => toUTCTimestamp('')).to.throw;
    done();
  });

  it('should throw an error from invalid input', (done) => {
    expect(() => toUTCTimestamp(1)).to.throw;
    expect(() => toUTCTimestamp(111111111111111111111111111)).to.throw;
    done();
  });

  it('should return a timestamp-string in seconds from input in seconds', (done) => {
    expect(toUTCTimestamp(validSeconds)).to.equal(validSeconds);
    expect(toUTCTimestamp(parseInt(validSeconds))).to.equal(validSeconds);
    done();
  });

  it('should return a timestamp-string in seconds from input in milliseconds', (done) => {
    expect(toUTCTimestamp(validMilliseconds)).to.equal(validSeconds);
    expect(toUTCTimestamp(parseInt(validMilliseconds))).to.equal(validSeconds);
    done();
  });

});

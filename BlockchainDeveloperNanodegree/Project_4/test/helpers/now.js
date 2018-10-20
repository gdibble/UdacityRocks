/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const now = require('../../helpers/now');
const validSeconds = '1539230582';

/**
 * now helper unit test
 */
describe('helpers/now', () => {

  it('should return a valid timestamp-string in seconds', (done) => {
    expect(now().length).to.exist;
    expect(now().length).to.equal(validSeconds.length);
    done();
  });

});

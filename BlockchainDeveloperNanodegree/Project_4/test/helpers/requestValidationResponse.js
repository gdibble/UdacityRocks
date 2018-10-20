/*global before,describe,it*/
'use strict';
const expect = require('chai').expect;
const consts = require('../../config/consts').toJS();
const requestValidationResponse = require('../../helpers/requestValidationResponse');
const testnetAddress = '14akRYnbByRqFQjvtnKV3anAs7rUHHSAgd';
const validTimestamp = '1539230460';
const validValidationWindow = 42;
const validResp = {
  address: testnetAddress,
  requestTimestamp: validTimestamp,
  message: [ testnetAddress, validTimestamp, consts.namespace ].join(':'),
  validationWindow: validValidationWindow
};
const resp = requestValidationResponse(testnetAddress, validTimestamp, validValidationWindow);

/**
 * requestValidationResponse helper unit test
 */
describe('helpers/requestValidationResponse', () => {

  before((done) => {
    setTimeout(() => { done(); }, 1881);
  });

  it('should throw an error for invalid arguments', (done) => {
    expect(() => requestValidationResponse()).to.throw;
    expect(() => requestValidationResponse(testnetAddress)).to.throw;
    expect(() => requestValidationResponse(testnetAddress.replace('1','9'), validTimestamp)).to.throw;
    expect(() => requestValidationResponse(testnetAddress, validTimestamp, -validValidationWindow)).to.throw;
    expect(() => requestValidationResponse(testnetAddress, validTimestamp, 8*validValidationWindow)).to.throw;
    done();
  });

  it('should return a valid response Object for valid arguments', (done) => {
    expect(resp).to.include(validResp);
    done();
  });

});

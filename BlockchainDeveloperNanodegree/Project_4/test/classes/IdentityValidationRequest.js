/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const IdentityValidationRequest = require('../../classes/IdentityValidationRequest');
const testNetBitcoinAddress = '2MunkhBSNnzffDUMgMPNeqgWtsUAt9xdD1p';
const vr = new IdentityValidationRequest({ address:testNetBitcoinAddress });
const mockRequest = { received:1539500127615 };

/**
 * IdentityValidationRequest class unit test
 */
describe('classes/IdentityValidationRequest', () => {

  it('should return an instance of the IdentityValidationRequest class', (done) => {
    expect(vr instanceof IdentityValidationRequest).to.equal(true);
    done();
  });

  it('IdentityValidationRequest.addRequest should throw an error from invalid request timestamp', (done) => {
    expect(() => vr.addRequest()).to.throw;
    expect(() => vr.addRequest(vr)).to.throw;
    expect(() => vr.addRequest(null, {})).to.throw;
    expect(() => vr.addRequest(null, { received:'notATimestamp' })).to.throw;
    done();
  });

  it('IdentityValidationRequest.addRequest return the validation-request with added `request`', (done) => {
    const requestAdded = vr.addRequest(vr, mockRequest);
    expect(requestAdded).to.be.an('object');
    expect(requestAdded.requests).to.be.an('array');
    expect(requestAdded.requests).to.include(mockRequest);
    done();
  });

});

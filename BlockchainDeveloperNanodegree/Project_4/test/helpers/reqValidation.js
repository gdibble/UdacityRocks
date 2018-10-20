/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const reqValidation = require('../../helpers/reqValidation');
const testnetAddress = '14akRYnbByRqFQjvtnKV3anAs7rUHHSAgd';
const exPayload = { address:testnetAddress };
const exReqInfo = { received:1539230582269 };

/**
 * reqValidation helper unit test
 */
describe('helpers/reqValidation', () => {

  it('should throw an error for invalid arguments', () => {
    expect(() => reqValidation()).to.throw;
    expect(() => reqValidation(exPayload)).to.throw;
    expect(() => reqValidation({ address:exPayload.address.slice(0, -9) }, exReqInfo)).to.throw;
    expect(() => reqValidation(exPayload, {})).to.throw;
  });

  it('should return a valid response Object for valid arguments', async () => {
    const resp = await reqValidation(exPayload, exReqInfo);
    expect(resp).to.be.an('object');
  });

});

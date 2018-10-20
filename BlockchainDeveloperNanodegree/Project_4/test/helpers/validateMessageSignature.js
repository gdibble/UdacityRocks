/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const PrivateKey = require('bitcore-lib').PrivateKey;
const Message = require('bitcore-message');
const validateMessageSignature = require('../../helpers/validateMessageSignature');
const toUTCTimestamp = require('../../helpers/toUTCTimestamp');
const requestValidationResponse = require('../../helpers/requestValidationResponse');
const exReqInfo = { received:1539230582269 };
const testnetAddress = '14akRYnbByRqFQjvtnKV3anAs7rUHHSAgd';
const testnetAddrPk = 'KxCNQK4qhVbzkotway139RQBJjdfKhhfg8UJiPpqa5MtxyPNfRH2';
const exValidationResponse = requestValidationResponse(testnetAddress, toUTCTimestamp(exReqInfo.received));
const exPayload = { address:testnetAddress, signature:Message(exValidationResponse.message).sign(PrivateKey(testnetAddrPk, 'livenet')) };
const badPayload = Object.assign({}, exPayload, { address:exPayload.address.slice(0, -9) });  // Creates invalid address

/**
 * validateMessageSignature helper unit test
 */
describe('helpers/validateMessageSignature', () => {

  it('should throw an error from invalid arugments', async () => {
    expect(() => validateMessageSignature()).to.throw;
    expect(() => validateMessageSignature(void(0), void(0))).to.throw;
    expect(() => validateMessageSignature(exPayload)).to.throw;
    expect(() => validateMessageSignature(void(0), exReqInfo)).to.throw;
    const invalidOutput = await validateMessageSignature(badPayload, exReqInfo);
    expect(invalidOutput).to.include({ registerStar:false });
    expect(invalidOutput.status).to.include({ error:validateMessageSignature.errMsg, messageSignature:'invalid' });
  });

  it('should accept valid arugments and return an Object', async () => {
    const validOutput = await validateMessageSignature(exPayload, exReqInfo);
    expect(validOutput).to.include({ registerStar:true });
  });

});

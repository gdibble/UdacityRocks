/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const serverOrig = require('../../config/server');
const server = require('../../config/server');

/**
 * server config unit test
 */
describe('config/server', () => {

  it('should return an immutable Object', (done) => {
    server.host = 'changed';
    server.port = 'changed';
    expect(server.host).to.equal(serverOrig.host);
    expect(server.port).to.equal(serverOrig.port);
    done();
  });

});

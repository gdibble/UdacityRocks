/*global after,describe,it*/
'use strict';
const expect = require('chai').expect;
const server = require('../../server');
const rootInfo_GET = {
  method: 'GET',
  url: '/'
};

describe('Hapi server', () => {

  after(() => {
    server.stop({ timeout:10000 }).then((/*e*/) => {
      console.log('  Hapi server stopped.');
      // process.exit((e) ? 1 : 0);  // Stop node process (here, probably not)
    });
  });

  it('should validate if server is running', () => {
    return server.inject(rootInfo_GET).then((response) => {
      expect(response.payload).to.include('Star Registry API Nominal');
      expect(response.statusCode).to.equal(200);
    });
  });

  it('should invalidate if server is running', () => {
    return server.inject(rootInfo_GET).then((response) => {
      expect(response.statusCode).to.not.be.above(206);
    });
  });

});

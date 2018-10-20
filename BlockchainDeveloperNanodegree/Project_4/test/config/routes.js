/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const routes = require('../../config/routes');
const keys = Object.keys(routes.toJS());

/**
 * routes config unit test
 */
describe('config/routes', () => {

  it('should return an immutable Object', (done) => {
    routes.new = {};
    expect(Object.keys(routes.toJS()).length).to.equal(keys.length);
    done();
  });

});

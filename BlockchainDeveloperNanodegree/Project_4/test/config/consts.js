/*global describe,it*/
'use strict';
const expect = require('chai').expect;
const Immutable = require('immutable');
const consts = require('../../config/consts').toJS();
const consts1 = Immutable.Map(consts);
const consts2 = Immutable.Map(consts);

/**
 * consts config unit test
 */
describe('config/consts', () => {

  it('should return an immutable Object', (done) => {
    consts2.set('namespace', 'changed');
    consts2.set('validationWindow', 'changed');
    expect(consts2.get('namespace')).to.equal(consts1.get('namespace'));
    expect(consts2.get('validationWindow')).to.equal(consts1.get('validationWindow'));
    done();
  });

});

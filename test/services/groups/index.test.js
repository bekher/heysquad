'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('groups service', function() {
  it('registered the groups service', () => {
    assert.ok(app.service('groups'));
  });
});

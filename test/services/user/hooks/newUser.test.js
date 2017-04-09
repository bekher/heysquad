'use strict';

const assert = require('assert');
const newUser = require('../../../../src/services/user/hooks/newUser.js');

describe('user newUser hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    newUser()(mockHook);

    assert.ok(mockHook.newUser);
  });
});

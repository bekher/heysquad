'use strict';

const assert = require('assert');
const getFbInfo = require('../../../../src/services/user/hooks/getFbInfo.js');

describe('user getFbInfo hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    getFbInfo()(mockHook);

    assert.ok(mockHook.getFbInfo);
  });
});

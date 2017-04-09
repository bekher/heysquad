'use strict';

const assert = require('assert');
const groupCreate = require('../../../../src/services/group/hooks/groupCreate.js');

describe('group groupCreate hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    groupCreate()(mockHook);

    assert.ok(mockHook.groupCreate);
  });
});

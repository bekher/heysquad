'use strict';

// src/services/groups/hooks/groupCreate.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.groupCreate = true;
    hook.app.ipcSock.emit("newTopic", 
      {
        "facebookId": hook.data.facebookId,
        "string": hook.data.query
      });
    hook.data.waiting = true;
    hook.app.ipcSock.on('recs', (res) => {

    });
  };
};

'use strict';

// src/services/user/hooks/getFbInfo.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const fb = require('fb');
const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.getFbInfo = true;
    /*
    const token = hooks.data;//get somehow;
    fb.setAccessToken(token);
    fb.api("me?fields=email,picture,name,id", (res) => {
      console.log(res);
      console.log(res.picture.data.url);
    });
    */
  };
};

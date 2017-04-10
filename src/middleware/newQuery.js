'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    res.redirect('/chat.html?query='+req.body.query);
    //next();
  };
};

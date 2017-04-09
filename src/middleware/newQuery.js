'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    var query = req.query.query || '';
    res.redirect('/chat.html?query='+query);
    //next();
  };
};

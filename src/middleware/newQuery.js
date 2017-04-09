'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    // Perform actions
  
    console.log(req.query);
    var query = req.query ?? '';
    res.redirect('/chat.html?query='+query);
    next();
  };
};

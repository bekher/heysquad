'use strict';

const service = require('feathers-mongoose');
const groups = require('./groups-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: groups,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/groups', service(options));

  // Get our initialize service to that we can bind hooks
  const groupsService = app.service('/groups');

  // Set up our before hooks
  groupsService.before(hooks.before);

  // Set up our after hooks
  groupsService.after(hooks.after);
};

'use strict';

// groups-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  topic: {
    type: String
  },
  facebookIds: [{
    type: String
  }]
});

const groupsModel = mongoose.model('groups', groupsSchema);

module.exports = groupsModel;

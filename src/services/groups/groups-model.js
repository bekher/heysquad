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
  query: {
    type: String
  },
  topic: {
    type: String
  },
  facebookIds: [{
    type: String
  }],
  waiting: {
    type: Boolean,
    default: true
  }
});

const groupsModel = mongoose.model('groups', groupsSchema);

module.exports = groupsModel;

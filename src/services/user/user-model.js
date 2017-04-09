'use strict';

// user-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  facebookId: { type: String, required: true, unique: true },
  facebook: { type: Schema.Types.Mixed },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'group'
  }],
  keywords: [{
    friends: [{
      type: String
    }],
  }],
  
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const userModel = mongoose.model('user', userSchema);

userSchema.plugin(idvalidator);

module.exports = userModel;

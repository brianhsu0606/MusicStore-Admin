const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    name: { type: String, required: true },
    gender: { type: String, default: '' },
    birth: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: 'avatar1.jpeg' },
    role: { type: String, required: true },
    lastLogin: { type: String, default: '' },
  }
});
toJSON(userSchema)

module.exports = mongoose.model('User', userSchema)
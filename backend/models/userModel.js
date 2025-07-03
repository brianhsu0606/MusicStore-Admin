const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const userSchema = new mongoose.Schema({
  employeeId: { type: Number, unique: true, index: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    name: { type: String, required: true },
    gender: { type: String, default: '' },
    birth: { type: Date, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: 'avatar1.jpg' },
    lastLogin: { type: Date, default: '' },
  }
})
toJSON(userSchema)

module.exports = mongoose.model('User', userSchema)
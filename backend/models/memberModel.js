const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const memberSchema = new mongoose.Schema({
  createdAt: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birth: { type: String, required: true },
  addr: { type: String },
}, { timestamps: true })
toJSON(memberSchema)

module.exports = mongoose.model('Member', memberSchema)

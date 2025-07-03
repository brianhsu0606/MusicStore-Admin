const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const memberSchema = new mongoose.Schema({
  memberId: { type: Number, unique: true, index: true },
  createdAt: { type: Date, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birth: { type: Date },
  addr: { type: String },
})
toJSON(memberSchema)

module.exports = mongoose.model('Member', memberSchema)

const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const revenueSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true },
  note: { type: String },
  createdBy: { type: String, required: true },
}, { timestamps: true })
toJSON(revenueSchema)

module.exports = mongoose.model('Revenue', revenueSchema)
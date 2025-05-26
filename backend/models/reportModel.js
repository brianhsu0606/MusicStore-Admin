const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const reportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  revenue: { type: Number, required: true },
  note: { type: String },
  createdBy: { type: String, required: true },
}, { timestamps: true })
toJSON(reportSchema)

module.exports = mongoose.model('Report', reportSchema)
const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const revenueSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true },
})
toJSON(revenueSchema)

module.exports = mongoose.model('Revenue', revenueSchema)
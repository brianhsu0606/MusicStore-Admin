const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const costSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true })
toJSON(costSchema)

module.exports = mongoose.model('Cost', costSchema)
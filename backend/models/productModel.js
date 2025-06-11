const mongoose = require('mongoose')
const toJSON = require('../utils/toJSON')

const productSchema = new mongoose.Schema({
  lastStockIn: { type: Date, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
}, { timestamps: true })
toJSON(productSchema)

module.exports = mongoose.model('Product', productSchema)
const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON')

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String },
  createdAt: { type: Date, required: true },
  member: { type: String, required: true },
  items: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
});
toJSON(orderSchema)

module.exports = mongoose.model('Order', orderSchema)
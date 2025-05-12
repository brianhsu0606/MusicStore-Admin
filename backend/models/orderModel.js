const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON')

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  createdAt: { type: String, required: true },
  member: { type: String, required: true },
  items: { type: String, required: true },
  status: { type: String, required: true },
});
toJSON(orderSchema)

module.exports = mongoose.model('Order', orderSchema)
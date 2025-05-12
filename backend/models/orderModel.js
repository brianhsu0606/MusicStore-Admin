const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  createdAt: { type: String, required: true },
  member: { type: String, required: true },
  items: { type: String, required: true },
  status: { type: String, required: true },
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

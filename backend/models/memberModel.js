const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  birth: { type: String, required: true },
  addr: { type: String, required: true },
});
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;

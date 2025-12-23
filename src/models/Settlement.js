const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  groupName: String,
  from: String,
  to: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Settlement", settlementSchema);

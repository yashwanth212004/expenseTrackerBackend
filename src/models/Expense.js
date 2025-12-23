const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  groupName: String,            // ✅ FIXED
  paidBy: String,
  amount: Number,
  splitType: { type: String, enum: ["EQUAL", "EXACT", "PERCENT"] },
  splits: [
    {
      userName: String,
      value: Number
    }
  ]
});

module.exports = mongoose.model("Expense", expenseSchema);

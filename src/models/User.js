const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  upiId: String
});

module.exports = mongoose.model("User", userSchema);

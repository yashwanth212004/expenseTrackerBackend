const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  members: [String] // store userName directly
});

module.exports = mongoose.model("Group", groupSchema);

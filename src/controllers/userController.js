const User = require("../models/User");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUserByName = async (req, res) => {
  console.log(req.params.name)
  const user = await User.findOne({ name: req.params.name });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.json(user);
};

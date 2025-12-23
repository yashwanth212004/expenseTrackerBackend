const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  const group = await Group.create(req.body);
  res.status(201).json(group);
};

exports.getAllGroups = async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
};

exports.getGroupByName = async (req, res) => {
  console.log(req.params.name)
  const group = await Group.findOne({ name: req.params.name });
  if (!group) {
    return res.status(404).json({ msg: "Group not found" });
  }
  res.json(group);
};

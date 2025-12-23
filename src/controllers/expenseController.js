const Expense = require("../models/Expense");
const Group = require("../models/Group");
const Settlement = require("../models/Settlement");
const calculateSettlements = require("../utils/Settlement");

exports.addExpense = async (req, res) => {
  const {
    groupName,
    paidBy,
    amount,
    splitType,
    splits,
    participants
  } = req.body;

  const group = await Group.findOne({ name: groupName });
  if (!group) return res.status(404).json({ msg: "Group not found" });

  let finalSplits = [];

  // ---------------- EQUAL SPLIT ----------------
  if (splitType === "EQUAL") {
    if (!participants || participants.length === 0) {
      return res
        .status(400)
        .json({ msg: "Participants required for equal split" });
    }

    const perUser = amount / participants.length;
    finalSplits = participants.map(u => ({
      userName: u,
      value: perUser
    }));
  }

  // ---------------- EXACT SPLIT ----------------
  if (splitType === "EXACT") {
    if (!splits || splits.length === 0) {
      return res
        .status(400)
        .json({ msg: "Splits required for exact split" });
    }

    const sum = splits.reduce((a, b) => a + b.value, 0);
    if (sum !== amount) {
      return res.status(400).json({ msg: "Exact split mismatch" });
    }

    finalSplits = splits;
  }

  // ---------------- PERCENT SPLIT ----------------
  if (splitType === "PERCENT") {
    if (!splits || splits.length === 0) {
      return res
        .status(400)
        .json({ msg: "Splits required for percent split" });
    }

    const percentSum = splits.reduce((a, b) => a + b.value, 0);
    if (percentSum !== 100) {
      return res.status(400).json({ msg: "Percent must be 100" });
    }

    finalSplits = splits.map(s => ({
      userName: s.userName,
      value: (s.value * amount) / 100
    }));
  }

  const expense = await Expense.create({
    groupName,
    paidBy,
    amount,
    splitType,
    splits: finalSplits
  });

  res.status(201).json(expense);
};

exports.getSettlements = async (req, res) => {
  const expenses = await Expense.find({
    groupName: req.params.groupName
  });
  const settlements = await Settlement.find({
    groupName: req.params.groupName
  });

  res.json(calculateSettlements(expenses, settlements));
};


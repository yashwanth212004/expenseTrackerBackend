const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
const calculateSettlements = require("../utils/Settlement");

exports.getUserBalancesInGroup = async (req, res) => {
  const { groupName, userName } = req.params;

  const expenses = await Expense.find({ groupName });
  const settlements = await Settlement.find({ groupName });

  const simplified = calculateSettlements(expenses, settlements);

  const dues = simplified
  .filter(s => s.from === userName && s.amount > 0)
  .map(s => ({
    to: s.to,
    amount: Math.round(s.amount * 100) / 100
  }));


  res.json({
    user: userName,
    group: groupName,
    dues
  });
};
exports.clearUserBalancesInGroup = async (req, res) => {
  const { groupName, userName } = req.params;
  const { recipients } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ msg: "Recipients required" });
  }

  const expenses = await Expense.find({ groupName });
  const settlements = await Settlement.find({ groupName });

  const simplified = calculateSettlements(expenses, settlements);

  // Build lookup: from -> to -> amount
  const dueMap = {};
  simplified.forEach(({ from, to, amount }) => {
    if (!dueMap[from]) dueMap[from] = {};
    dueMap[from][to] = amount;
  });

  // Validate all recipients
  for (let r of recipients) {
    if (!dueMap[userName] || !dueMap[userName][r]) {
      return res.status(400).json({
        msg: `Invalid recipient or no due found: ${r}`,
        cleared: false
      });
    }
  }

  // Clear FULL balances only
  const records = recipients.map(r => ({
    groupName,
    from: userName,
    to: r,
    amount: dueMap[userName][r]
  }));

  await Settlement.insertMany(records);

  res.status(201).json({
    msg: "Balances cleared successfully",
    clearedFor: userName,
    group: groupName,
    clearedWith: records
  });
};

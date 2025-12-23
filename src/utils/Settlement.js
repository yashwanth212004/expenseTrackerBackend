module.exports = function (expenses, settlements = []) {
  const balance = {};

  // 1️⃣ Expenses
  expenses.forEach(exp => {
    exp.splits.forEach(s => {
      balance[s.userName] = (balance[s.userName] || 0) - s.value;
    });
    balance[exp.paidBy] = (balance[exp.paidBy] || 0) + exp.amount;
  });

  // 2️⃣ Settlements (clearings)
  settlements.forEach(s => {
    balance[s.from] = (balance[s.from] || 0) + s.amount;
    balance[s.to] = (balance[s.to] || 0) - s.amount;
  });

  // 3️⃣ Separate positive & negative balances
  const pos = [], neg = [];
  Object.entries(balance).forEach(([user, bal]) => {
    if (bal > 0.0001) pos.push({ user, bal });
    if (bal < -0.0001) neg.push({ user, bal });
  });

  pos.sort((a, b) => b.bal - a.bal);
  neg.sort((a, b) => a.bal - b.bal);

  const res = [];
  let i = 0, j = 0;

  while (i < pos.length && j < neg.length) {
    const amt = Math.min(pos[i].bal, -neg[j].bal);
    const roundedAmt = Math.round(amt * 100) / 100;

    // ✅ DO NOT push zero / near-zero settlements
    if (roundedAmt > 0) {
      res.push({
        from: neg[j].user,
        to: pos[i].user,
        amount: roundedAmt
      });
    }

    pos[i].bal -= amt;
    neg[j].bal += amt;

    // ✅ Use tolerance instead of exact zero
    if (Math.abs(pos[i].bal) < 0.0001) i++;
    if (Math.abs(neg[j].bal) < 0.0001) j++;
  }

  return res;
};

const router = require("express").Router();
const { addExpense, getSettlements } = require("../controllers/expenseController");

router.post("/", addExpense);
router.get("/settlements/:groupId", getSettlements);

module.exports = router;

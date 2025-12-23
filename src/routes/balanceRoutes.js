const router = require("express").Router();
const {
  getUserBalancesInGroup,
  clearUserBalancesInGroup
} = require("../controllers/balanceController");

router.get("/:groupName/:userName", getUserBalancesInGroup);
router.post("/:groupName/:userName/clear", clearUserBalancesInGroup);

module.exports = router;

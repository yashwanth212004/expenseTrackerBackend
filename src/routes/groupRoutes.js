const router = require("express").Router();
const {
  createGroup,
  getAllGroups,
  getGroupByName
} = require("../controllers/groupController");

router.post("/", createGroup);
router.get("/", getAllGroups);
router.get("/:name", getGroupByName);

module.exports = router;

const router = require("express").Router();
const {
  createUser,
  getAllUsers,
  getUserByName
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:name", getUserByName);

module.exports = router;

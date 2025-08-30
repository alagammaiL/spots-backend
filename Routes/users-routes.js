const express = require("express");
const {
  getAllUsers,
  login,
  signUp,
  authProtect,
} = require("../Controller/user-controller");
const { userFileUpload } = require("../file-upload");
const router = express.Router();

router.route("/").get(getAllUsers);
router.post("/login", login);
router.post("/signUp", userFileUpload, signUp);
module.exports = router;

const express = require("express");
const {
  createPost,
  getAllPost,
  getAllPostOfUser,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

router.route("/post").post(isLoggedIn, createPost);
router.route("/postofuser").get(isLoggedIn, getAllPostOfUser);

router.route("/posts").get(getAllPost);

module.exports = router;

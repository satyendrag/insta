const express = require("express");
const {
  createPost,
  getAllPost,
  getAllPostOfUser,
  comment,
  getAllComment,
  like,
  disLike,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

router.route("/post").post(isLoggedIn, createPost);
router.route("/postofuser").get(isLoggedIn, getAllPostOfUser);

router.route("/posts").get(getAllPost);
router.route("/comment").post(isLoggedIn, comment);

router.route("/getallcomment").post(isLoggedIn, getAllComment);
router.route("/like").put(isLoggedIn, like);
router.route("/dislike").put(isLoggedIn, disLike);

module.exports = router;

const Post = require("../models/Post");
const catchAsyncError = require("../middlewares/catchAsyncError");
const CustomError = require("../utils/CustomError");
const cloudinary = require("cloudinary");

exports.createPost = catchAsyncError(async (req, res, next) => {
  const { title, body = "" } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Please Provide title",
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "No image found",
    });
  }

  let photos = [];
  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "posts",
        }
      );
      photos.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  const post = await Post.create({
    title,
    body,
    photos,
    postedBy: req.user._id,
  });

  if (!post) {
    return res.status(500).json({
      success: false,
      message: "Unable to create post. Internal server error.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Post created",
    post,
  });
});

exports.getAllPost = catchAsyncError(async (req, res, next) => {
  const posts = await Post.find().populate("postedBy", "name");
  res.status(200).json({
    success: true,
    message: "Fetched all post",
    posts,
  });
});

exports.getAllPostOfUser = catchAsyncError(async (req, res, next) => {
  const id = req.user._id;
  const posts = await Post.find({ postedBy: id });
  if (posts.length == 0) {
    return res.status(200).json({
      success: true,
      message: "No post by the user",
    });
  }
  res.status(200).json({
    success: true,
    message: "Fetched all post of the user",
    posts,
  });
});

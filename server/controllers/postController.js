const Post = require("../models/Post");
const catchAsyncError = require("../middlewares/catchAsyncError");
const CustomError = require("../utils/CustomError");
const cloudinary = require("cloudinary");

exports.createPost = catchAsyncError(async (req, res, next) => {
  const { title = "", body = "" } = req.body;
  // if (!title) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please Provide title",
  //   });
  // }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "No image found",
    });
  }

  let photos = [];
  console.log(req.files);
  if (req.files) {
    let files = req.files.photos;
    if (!Array.isArray(files)) {
      let result = await cloudinary.v2.uploader.upload(files.tempFilePath, {
        folder: "posts",
      });
      photos.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    } else {
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
  // const { skip, limit } = req.query;
  // console.log(skip * limit, limit);
  const posts = await Post.find()
    .populate("postedBy", "name photo email")

    .sort({ createdAt: -1 });
  // .skip(skip)
  // .limit(limit);
  const totalPost = await Post.countDocuments();

  res.status(200).json({
    success: true,
    message: "Fetched all post",
    posts,
    totalPost,
  });
});

exports.getAllPostOfUser = catchAsyncError(async (req, res, next) => {
  const id = req.user._id;
  const posts = await Post.find({ postedBy: id });
  res.status(200).json({
    success: true,
    message: "Fetched all post of the user",
    posts,
  });
});

exports.comment = catchAsyncError(async (req, res, next) => {
  const { text, postId } = req.body;
  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Comment text should not be empty",
    });
  }
  const comment = {
    text,
    commentBy: req.user._id,
  };
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  ).populate("comments.commentBy", "_id name photo");

  res.status(200).json({
    success: true,
    message: "Commented",
    post,
  });
});

exports.getAllComment = catchAsyncError(async (req, res, next) => {
  const { postId } = req.body;
  const post = await Post.findById(postId).populate(
    "comments.commentBy",
    "_id name photo"
  );
  res.status(200).json({
    success: true,
    comments: post.comments,
  });
});

exports.like = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const post = await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  );
  res.status(201).json({
    success: true,
    post,
  });
});

exports.disLike = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const post = await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  );
  res.status(201).json({
    success: true,
    post,
  });
});

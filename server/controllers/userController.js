const User = require("../models/User");
const catchAsyncError = require("../middlewares/catchAsyncError");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

exports.signup = catchAsyncError(async (req, res, next) => {
  let imageUploadResult;
  if (req.files) {
    // name attribute value should be photo
    let file = req.files.photo;
    imageUploadResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new CustomError("Name, email, and password are required", 400));
  }

  const isUserAlreadyExist = await User.findOne({ email: email });

  if (isUserAlreadyExist) {
    return next(new CustomError("Email already exist", 400));
  }

  if (!imageUploadResult) {
    return next(new CustomError("Image Upload failed", 500));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: imageUploadResult.public_id,
      secure_url: imageUploadResult.secure_url,
    },
  });

  cookieToken(res, user);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user provided email and password or not
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  // getting user for given email id
  const user = await User.findOne({ email }).select("+password");

  // cheking if user exist in our database or not
  if (!user) {
    return next(new CustomError("Invalid Email/Password", 400));
  }

  // checking if password is valid or not
  const isValidUser = await user.isValidatedPassword(password);

  if (!isValidUser) {
    return next(new CustomError("Invalid Email/Password", 400));
  }
  // If everything is okay then good to go sending response to user
  cookieToken(res, user);
});

exports.logout = catchAsyncError((req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Success",
  });
});

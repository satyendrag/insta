const User = require("../models/User");
const catchAsyncError = require("../middlewares/catchAsyncError");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

exports.signup = catchAsyncError(async (req, res, next) => {
  let imageUploadResult;

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }

  const isUserAlreadyExist = await User.findOne({ email: email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      success: false,
      message: "Email already exist",
    });
  }

  if (req.files) {
    // name attribute value should be photo
    let file = req.files.photo;
    imageUploadResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }
  if (!imageUploadResult) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
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

  res.status(201).json({
    success: true,
    message: "Signup Successfull. Please Login",
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user provided email and password or not
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide email and password",
    });
  }

  // getting user for given email id
  const user = await User.findOne({ email }).select("+password");

  // cheking if user exist in our database or not
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email/password",
    });
  }

  // checking if password is valid or not
  const isValidUser = await user.isValidatedPassword(password);

  if (!isValidUser) {
    return res.status(400).json({
      success: false,
      message: "Invalid email/password",
    });
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

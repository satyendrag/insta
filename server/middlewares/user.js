const User = require("../models/User");
const catchAsyncError = require("./catchAsyncError");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = await User.findById(id);

  req.user = user;

  next();
});

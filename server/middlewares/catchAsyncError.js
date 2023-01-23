const catchAsyncError = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = catchAsyncError;

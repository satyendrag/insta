const catchAsyncError = (fn) => async (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
    });
  }
};

module.exports = catchAsyncError;

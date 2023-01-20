const express = require("express");

const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "temp/",
  })
);

// inject morgan before router
app.use(morgan("tiny"));

// imports all routes here
const user = require("./routes/user");

// router middleware
app.use("/api/v1", user);

// export app js
module.exports = app;

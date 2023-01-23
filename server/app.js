const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// regular middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whiteList = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors());
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
const user = require("./routes/userRoute");
const post = require("./routes/postRoute");
// router middleware
app.use("/api/v1", user);
app.use("/api/v1/", post);

// export app js
module.exports = app;

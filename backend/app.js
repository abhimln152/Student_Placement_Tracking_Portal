require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
require("./config/passport_jwt_strategy");
const connectDB = require("./config/mongoose");
connectDB();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Routes
app.use("/api/v1", require("./routes"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Server Error ${err}`);
  }
  console.log(`Server is running on port ${port}`);
});

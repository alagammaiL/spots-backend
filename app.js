const express = require("express");
const userRouter = require("./Routes/users-routes");
const placeRouter = require("./Routes/places-routes");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const AppError = require("./Apperror");
const errorController = require("./Controller/errorController");
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://resplendent-souffle-5d44b3.netlify.app/", // frontend on Replit
];
const app = express();
app.use("/images/users", express.static(path.join("images", "users")));
app.use("/images/places", express.static(path.join("images", "places")));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/places", placeRouter);
app.use("/api/users", userRouter);
app.use((req, res, next) => {
  next(new AppError(`not found path ${req.originalUrl}`, 404));
});
app.use(errorController);
module.exports = app;

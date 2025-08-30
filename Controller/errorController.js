const fs = require("fs");
module.exports = (error, req, res, next) => {
  // console.log(res, res.headersSent);

  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  let statusCode = error.statusCode || 500;
  let status = error.status || "error";
  if (error.name === "ValidationError") {
    statusCode = 400;
    status = "fail";
    const data = Object.keys(error.errors).map(
      (key) => error.errors[key].message
    );
    error.message = [...data];
  }
  res.status(statusCode).json({
    status: status,
    error,
    stack: error.stack,
    message: error.message,
  });
};

const { v4: uuidv4 } = require("uuid");
const AppError = require("../Apperror");
const UserModal = require("../models/UserSchema");
const catchasync = require("../catchasync");
const userModal = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
function jwtTokenGenerate(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.jWT_EXPIRES_IN,
  });
}
const dummyUsers = [
  {
    id: "u1",
    name: "john",
    email: "john@gmail.com",
    password: "12345678",
  },
];
exports.getAllUsers = catchasync(async (req, res, next) => {
  const users = await userModal
    .find()
    .populate({
      path: "place",
      select: "-creator",
    })
    .select("-password");
  if (!users) {
    return next(new AppError("No users created", 400));
  }
  res.status(200).json({
    status: "success",
    data: { users },
  });
});
exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter both email and password", 401));
  }
  const user = await userModal.findOne({ email });
  if (!user || !(await user.bcrypthashMethod(password))) {
    return next(new AppError("email and password mismatch", 401));
  }
  const token = jwtTokenGenerate(user.id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
exports.signUp = catchasync(async (req, res, next) => {
  const { email, name, password } = req.body;
  // console.log("hello world", req.file.filename);
  req.body.image = `images/users/${req.file.filename}`;
  const user = await UserModal.create(req.body);
  const token = jwtTokenGenerate(user.id);
  res.status(201).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});
exports.authProtect = catchasync(async (req, res, next) => {
  console.log(req.headers);

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("please try to login"), 401);
  }
  const jwtdecodify = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  console.log(jwtdecodify);
  const user = await UserModal.findById(jwtdecodify.id);
  if (!user) {
    return next(new AppError("token invalid or expired", 401));
  }
  req.userdata = { id: user.id };
  next();
});

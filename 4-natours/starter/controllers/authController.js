const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');

const createToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // const newTour = Tour({ name: req.body.name, price: req.body.price, rating: req.body.rating });
  console.log('createsignUpATour was called');
  // const newUser = await User.create(req.body); //This is not a good way of creating a user, as it may allow all users to signup as admin, therefore checkout the next line:
  //By this line, we create a regular user, with only the data we want to.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo
  }); //This is not a good way of creating a user, as it may allow all users to signup as admin, therefore checkout the next line:

  const token = createToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exists
  if (!email || !password) {
    const err = new AppError('Please provide email or password', 400);
    return next(err);
  }

  //2) Check if user exists
  const user = await User.findOne({ email: email }).select('+password'); //The password is unselected by default, see in model. Here we explicitly adding it to selection for checking it for authentication

  //3) Check if password correct
  if (!user || !(await user.correctPassword(user.password, password))) {
    const err = new AppError('Incorrect user or password', 400);
    return next(err);
  }

  //4) If all good, send token to user
  const token = createToken(user._id);

  res.status(201).json({
    status: 'success',
    token: token
  });
});

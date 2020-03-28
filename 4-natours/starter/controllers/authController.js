const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');

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

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser
    }
  });
});

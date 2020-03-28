const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');

exports.signUp = catchAsync(async (req, res, next) => {
  // const newTour = Tour({ name: req.body.name, price: req.body.price, rating: req.body.rating });
  console.log('createsignUpATour was called');
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

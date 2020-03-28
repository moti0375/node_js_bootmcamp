const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');

//Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  //Execute the query
  const users = await User.find();

  //Sending the response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});

exports.checkId = (req, res, next, val) => {
  const user = User.find(el => el._id === val);
  // console.log(tour);

  if (user === undefined) {
    console.log(`User ${val} invalid, userMiddleware`);

    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  console.log(`${id}`);

  const user = User.find(el => el._id === id);
  // console.log(tour);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 1,
    data: {
      user
    }
  });
};

exports.updateUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log(`Update user: ${req.params.id}`);

  res.status(200).json({
    status: 'success',
    data: {
      user: 'Updated tour...'
    }
  });
};

exports.deleteUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log(`Delete user: ${req.params.id}`);

  res.status(204).json({
    status: 'success',
    data: null
  });
};

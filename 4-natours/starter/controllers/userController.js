const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user posts password data
  console.log(`UpdateMe was called ${JSON.stringify(req.body)}`);
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const { user } = req;

  console.log(`password: ${password}, confirmPassword: ${passwordConfirm}`);

  if (password !== undefined || passwordConfirm !== undefined) {
    return next(new AppError('Unable to change password for this action', 400));
  }

  //2)Update user document
  const bufUser = filterObj(req.body, 'name', 'email');

  console.log(`user ID: ${user._id}, ${JSON.stringify(bufUser)}`);

  //3) Save the user document
  const updateUser = await User.findByIdAndUpdate(user._id, bufUser, {
    new: true,
    runValidators: true
  });

  console.log(`Updated user: ${JSON.stringify(updateUser)}`);

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

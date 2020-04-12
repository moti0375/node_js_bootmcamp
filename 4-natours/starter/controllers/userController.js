const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

//Configure the multerStorage for users photos
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

//Multer filter for file types, here it pass take images files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images', 404), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  //TODO: handle update a user ...

  console.log(`About to delete user: ${req.user._id}`);
  const removed = await User.findByIdAndUpdate(req.user._id, { active: false });
  console.log(`Delete user: ${removed}`);

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.getMeMiddleware = (req, res, next) => {
  console.log(`Get me middleware`);

  req.params.id = req.user.id;
  console.log(`Req params: ${JSON.stringify(req.params)}`);
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user posts password data
  console.log(`UpdateMe was called ${JSON.stringify(req.body)}, ${JSON.stringify(req.file)}`);
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

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

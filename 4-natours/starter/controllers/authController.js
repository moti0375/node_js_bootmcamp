const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync.js');

const createToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createAndSendToken = (res, statusCode, user) => {
  const token = createToken(user._id);
  //Create jwt cookie
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true //Can be changed only by the browser
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
  //Done...

  user.password = undefined; //Remove the password from the output

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user
    }
  });
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
    photo: req.body.photo,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  }); //This is not a good way of creating a user, as it may allow all users to signup as admin, therefore checkout the next line:

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createAndSendToken(res, 201, newUser);
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
    const err = new AppError('Incorrect username or password', 401);
    console.log(`incorrect password: ${JSON.stringify(err)}`);
    return next(err);
  }

  //4) If all good, send token to user
  createAndSendToken(res, 201, user);
});

exports.logout = catchAsync(async (req, res, next) => {
  console.log('logout was called');
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000), //10 seconds
    httpOnly: true //Can be changed only by the browser
  };

  res.cookie('jwt', 'logedout', cookieOptions);
  res.status(200).json({
    status: 'success'
  });
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unathorized user', 403));
    }
    return next();
  });
};

exports.checkAuth = catchAsync(async (req, res, next) => {
  console.log(`Check auth middleware was called: ${JSON.stringify(req.headers)}`);
  //1) Get the token and check if it exists
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    console.log('Authorized by cookie: browser...');
    token = req.cookies.jwt;
  }

  // console.log(`Token: ${token}`);
  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }

  //2) Check token verification valid
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return next(new AppError("You're not logged in", 401));
  }
  console.log(decodedToken);

  //3) Check if the user still exists

  const { id } = decodedToken;
  console.log(`Looking for user: ${id}`);
  const user = await User.findById(id).select('+passwordChangedAt +password');

  if (!user) {
    console.log(`User not found... `);
    return next(new AppError('The user belonging this token no longer exists', 401));
  }

  // console.log(`Founded user: ${JSON.stringify(user)}`);
  //4) Check if user changed password after JWT was issued
  const { passwordChangedAt } = user;
  console.log(`Password changed date: ${passwordChangedAt}`);
  const passwordChanged = await user.changedPasswordAfter(decodedToken.iat);
  console.log(`Password changed: ${passwordChanged}`);

  if (passwordChanged) {
    return next(new AppError('User changed password after token issued...', 401));
  }

  //All set, get protected data!
  req.user = user; //We can now put the user into the request for later usages
  res.locals.user = user;
  next();
});

//Only for rendered pages..
exports.isLoggedIn = async (req, res, next) => {
  console.log(`Check isLoggedIn middleware was called: ${JSON.stringify(req.headers)}`);

  // console.log(`Token: ${token}`);
  //1) Get the token and check if it exists
  if (req.cookies.jwt) {
    try {
      //2) Check token verification valid
      const decodedToken = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      console.log(decodedToken);

      //3) Check if the user still exists

      const { id } = decodedToken;
      console.log(`Looking for user: ${id}`);
      const user = await User.findById(id).select('+passwordChangedAt +password');

      if (!user) {
        return next();
      }

      // console.log(`Founded user: ${JSON.stringify(user)}`);
      //4) Check if user changed password after JWT was issued
      const { passwordChangedAt } = user;
      console.log(`Password changed date: ${passwordChangedAt}`);
      const passwordChanged = await user.changedPasswordAfter(decodedToken.iat);
      console.log(`Password changed: ${passwordChanged}`);

      if (passwordChanged) {
        return next();
      }

      res.locals.user = user; //Makes the user available in views templates (pugs)
      return next();
    } catch (e) {
      next();
    }
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log('forgotPassword was called');
  //1) Check if email is in database
  const user = await User.findOne({ email: req.body.email });
  console.log(`Found user: ${user.name} ok`);
  if (!user) {
    return next(new AppError("We didn't found this email in our database", 404));
  }

  //2) Create a reset password token
  const resetToken = await user.createPasswordResetToken();
  console.log({ resetToken });
  // await user.save({ validateBeforeSave: false }); //Saving the updated user document with the new encrypted password reset token, disabling the vlidators is required because we don't have the full user details, only the values we read from the database in line 123 which are not all the required values..

  console.log(`User: id: ${user._id}: ${JSON.stringify(user)}`);

  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
    new: false,
    runValidators: false //The validators will run again when updating a document
  });
  console.log(`Updated User: id: ${updatedUser}: ${JSON.stringify(user)}`);

  //3) Send token as email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  console.log(`Reset URL: ${resetUrl}`);

  // const mailOptions = {
  //   email: user.email,
  //   subject: 'Reset password',
  //   message: `Click here to reset password: ${resetUrl}`
  // };

  // try {
  //   await sendEmail(mailOptions);

  //   res.status(201).json({
  //     status: 'success',
  //     token: 'Reset token sent to your email'
  //   });
  // } catch (e) {
  //   console.error(e);
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   return next(new AppError('There was an error sending password reset token.. Please try again later', 500));
  // }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Extract reset password info from URL
  const { password } = req.body;
  const { confirmPassword } = req.body;
  const resetToken = req.params.token;

  console.log(`resetPasswordCalled: body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);

  const ecryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); //Encrypt the reset token and save it in the database, like we encrypt passwords

  console.log(`Encrypted token: ${ecryptedToken}`);
  const user = await User.findOne({
    passwordResetToken: ecryptedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select('+passwordResetExpires');

  if (!user) {
    return next(new AppError("Can't find user for this token", 400));
  }

  //3) Check if reset token expired
  // const tokenExpiration = user.passwordResetExpires;
  // console.log(`Found user: ${user.name}, token expiration date: ${tokenExpiration}`);

  // if (new Date() > tokenExpiration) {
  //   return next(new AppError('Reset token expired, please try again', 401));
  // }

  user.password = password;
  user.passwordConfirm = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //5) Delete resetPassword token and token experation date from user document
  createAndSendToken(res, 201, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get the user from the collection
  const { user } = req;
  console.log(`Update password: ${JSON.stringify(user)}`);

  //2) Check if Posted current password is correct
  const { oldPassword, newPassword, confirmPassword } = req.body;

  console.log(
    `Updating password: oldPassword: ${oldPassword}, newPassword: ${newPassword}, confirmPassword: ${confirmPassword}`
  );

  if (!user || !(await user.correctPassword(user.password, oldPassword))) {
    const err = new AppError('Incorrect username or password', 401);
    console.log(`incorrect password: ${JSON.stringify(err)}`);
    return next(err);
  }

  //3) Update user password in collection
  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();

  //4) Send new JWT token
  createAndSendToken(res, 201, user);
});

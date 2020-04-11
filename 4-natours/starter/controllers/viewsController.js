const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  console.log('getOverView');
  //1. Get all tours from our collection
  const tours = await Tour.find();
  //2. Build template

  //3. Render the template using data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  });
  // next();
});

exports.getTourDetails = catchAsync(async (req, res, next) => {
  console.log(`getTourDetails: ${req.params.slug}`);
  //1) Get data for the selected tour, include the reviews and the tour guide
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour found', 404));
  }

  console.log(`Got tour review: ${JSON.stringify(tour.reviews[0])}`);
  //2) Build the template

  //3) Render the template using the tour
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });

  //   next();
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  console.log(`login:`);

  res.status(200).render('login', {
    title: `Natours Login`
  });
});

exports.getAccount = (req, res) => {
  console.log('getAccount was called');
  res.status(200).render('account', {
    title: `${res.locals.user.name} Account`
  });
};

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  //Execute the query
  const reviews = await Review.find(filter);

  //Sending the response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.author = req.user.id;
  console.log(`createAReview was called: ${JSON.stringify(req.body)}`);

  const newReviewDoc = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newReviewDoc
    }
  });
});

exports.getReviewsForTour = catchAsync(async (req, res, next) => {
  //Nested routes
  const reviews = await Review.find(req.params.id);
  // const ture = await Tour.findOne({ _id: req.params.id });  same as findById

  console.log(`getReviews: ${reviews}`);
  if (!reviews) {
    return next(new AppError(`Cannot find such tour with this id: ${req.params.id}`), 404);
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: {
      reviews
    }
  });
});

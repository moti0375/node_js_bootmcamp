const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //Execute the query
  const reviews = await Review.find();

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
  console.log('createAReview was called');
  const newReviewDoc = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newReviewDoc
    }
  });
});

exports.getReviewsForTour = catchAsync(async (req, res, next) => {
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

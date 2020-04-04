const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.checkAuth, authController.restrictTo('user'), reviewController.createReview);

router.route('/:id').get(authController.checkAuth, reviewController.getReviewsForTour);

module.exports = router;

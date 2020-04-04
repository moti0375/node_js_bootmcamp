const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.checkAuth, authController.restrictTo('user'), reviewController.createReview);

router
  .route('/:id')
  .delete(authController.checkAuth, authController.restrictTo('admin', 'lead-guide'), reviewController.deleteReview);
module.exports = router;

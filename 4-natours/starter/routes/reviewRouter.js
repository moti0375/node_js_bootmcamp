const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.checkAuth,
    authController.restrictTo('user'),
    reviewController.setTourAndUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(authController.checkAuth, reviewController.getReview)
  .delete(authController.checkAuth, authController.restrictTo('admin', 'lead-guide'), reviewController.deleteReview)
  .patch(authController.checkAuth, reviewController.updateReview);
module.exports = router;

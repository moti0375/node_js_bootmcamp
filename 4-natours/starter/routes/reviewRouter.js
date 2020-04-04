const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.checkAuth); //This will cause all next routes to be for authenticated users

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('user'), reviewController.setTourAndUserId, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)
  .patch(authController.restrictTo('admin', 'user'), reviewController.updateReview);
module.exports = router;

const express = require('express');
const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();
// router.param('id', controller.checkId); //Used to work with local storage, no need to add this middleware for id checking
//Create a checkBody middleware
//Check if the body contains the name and the price properties
//Return 400 if not found

router.use('/:tourId/reviews', reviewRouter);

router.route('/top_five_cheep').get(controller.aliasTopTours, controller.getAllTours);
router.route('/stats').get(controller.getToursStats);
router.route('/monthly-plan/:year').get(controller.getMontlyPlan);

router
  .route('/')
  .get(authController.checkAuth, controller.getAllTours)
  .post(controller.createTour); //New version with route

router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(authController.checkAuth, authController.restrictTo('admin', 'lead-guide'), controller.deleteTour); //New version with route

module.exports = router;

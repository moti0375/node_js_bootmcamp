const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router();
// router.param('id', controller.checkId); //Used to work with local storage, no need to add this middleware for id checking
//Create a checkBody middleware
//Check if the body contains the name and the price properties
//Return 400 if not found

router
  .route('/')
  .get(controller.getAllTours)
  .post(controller.createTour); //New version with route

router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour); //New version with route

module.exports = router;

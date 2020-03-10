const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router();
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

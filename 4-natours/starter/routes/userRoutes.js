const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.param('id', controller.checkId); //Checking id middlware

router
  .route('/')
  .get(controller.getAllUsers)
  .post(controller.createUser);

router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;

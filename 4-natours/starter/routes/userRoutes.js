const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.route('/updatePassword').patch(authController.checkAuth, authController.updatePassword);

router.route('/').get(controller.getAllUsers);

router.route('/updateMe').patch(authController.checkAuth, controller.updateMe);
router.route('/deleteMe').delete(authController.checkAuth, controller.deleteMe);

router
  .route('/:id')
  .get(controller.getUser)
  .delete(authController.checkAuth, controller.deleteUser)
  .patch(authController.checkAuth, authController.restrictTo('admin'), controller.updateUser);

module.exports = router;

const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.route('/updatePassword').patch(authController.checkAuth, authController.updatePassword);

//Protect all routes after this middleware
router.use(authController.checkAuth); //This will cause all next routes to be for authenticated users

router.route('/updateMe').patch(controller.updateMe);
router.route('/deleteMe').delete(controller.deleteMe);
router.route('/me').get(controller.getMeMiddleware, controller.getUser);

router.use(authController.restrictTo('admin')); //This will cause all next routes to be for admin
router.route('/').get(controller.getAllUsers);

router
  .route('/:id')
  .get(controller.getUser)
  .delete(authController.restrictTo('admin'), controller.deleteUser)
  .patch(authController.restrictTo('admin'), controller.updateUser);

module.exports = router;

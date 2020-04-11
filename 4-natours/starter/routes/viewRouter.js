const express = require('express');
const controller = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, controller.getOverview);
router.get('/login', authController.isLoggedIn, controller.getLoginForm);

router.get('/overview', authController.isLoggedIn, controller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, controller.getTourDetails);
router.get('/me', authController.checkAuth, controller.getAccount);

router.post('/submit-user-data', authController.checkAuth, controller.updateUserData);

module.exports = router;

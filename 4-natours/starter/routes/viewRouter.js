const express = require('express');
const controller = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', controller.getOverview);
router.get('/login', controller.getLoginForm);

router.get('/overview', authController.checkAuth, controller.getOverview);
router.get('/tour/:slug', authController.checkAuth, controller.getTourDetails);

module.exports = router;

const express = require('express');
const controller = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn); //This will cause all next routes render the page according to user logged in or not

router.get('/', controller.getOverview);
router.get('/login', controller.getLoginForm);

router.get('/overview', controller.getOverview);
router.get('/tour/:slug', controller.getTourDetails);

module.exports = router;

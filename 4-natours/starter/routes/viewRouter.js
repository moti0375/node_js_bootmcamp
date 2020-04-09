const express = require('express');
const controller = require('../controllers/viewsController');

const router = express.Router();

router.get('/', controller.getOverview);
router.get('/overview', controller.getOverview);
router.get('/tour', controller.getTourDetails);

module.exports = router;

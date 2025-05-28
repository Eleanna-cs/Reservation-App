const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, restaurantController.getAllRestaurants);

module.exports = router;

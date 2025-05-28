const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = async (req, res) => {
    try {
        const [rows] = await Restaurant.getAll();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch restaurants', error: err });
    }
};

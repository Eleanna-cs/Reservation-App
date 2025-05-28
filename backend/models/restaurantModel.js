const db = require('../config/db');

const Restaurant = {
    getAll: () =>
        db.promise().query('SELECT * FROM restaurant'),

    getById: (id) =>
        db.promise().query('SELECT * FROM restaurant WHERE restaurant_id = ?', [id])
};

module.exports = Restaurant;

const db = require('../config/db');

const Reservation = {
    create: ({ user_id, restaurant_id, date, time, people_count }) =>
        db.promise().query(
            'INSERT INTO reservation (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
            [user_id, restaurant_id, date, time, people_count]
        ),

    getByUserId: (user_id) =>
        db.promise().query('SELECT * FROM reservation WHERE user_id = ?', [user_id]),

    deleteById: (id) =>
        db.promise().query('DELETE FROM reservation WHERE reservation_id = ?', [id]),

    getReservationById: (id) => 
   db.promise().query('SELECT * FROM reservation WHERE reservation_id = ?', [id]),

   confirmReservation: (reservation_id) => 
    db.promise().query('UPDATE reservation SET status = ? WHERE reservation_id = ?',
    ['confirmed', reservation_id]),
 


    declineReservation: (reservation_id) => 
   db.promise().query('UPDATE reservation SET status = ? WHERE reservation_id = ?',
    ['declined', reservation_id]
  ),
 

    updateById: ({ reservation_id, date, time, people_count }) =>
  db.promise().query(
   'UPDATE reservation SET date = ?, time = ?, people_count = ? WHERE reservation_id = ?',
    [date, time, people_count, reservation_id]
  ),

  updateReservationById: (id, { date, time, people_count }) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE reservation SET date = ?, time = ?, people_count = ? WHERE reservation_id = ?',
      [date, time, people_count, id],
      (err, result) => {
        if (err) {
  console.error('SQL error during update:', err);
  return reject(err);
}
        resolve(result);
      }
    );
  });
},

        
      getAll: () => {
    return db.promise().query(`
      SELECT 
        r.reservation_id,
        r.user_id,
        u.name,
        r.restaurant_id,
        rest.name AS restaurant_name,
        rest.address AS restaurant_address,
        rest.phone AS restaurant_phone,
        rest.description AS restaurant_description,
        r.date,
        r.time,
        r.people_count,
        r.status,
        r.created_at,
        r.updated_at
      FROM reservation r
      JOIN user u ON r.user_id = u.user_id
      JOIN restaurant rest ON r.restaurant_id = rest.restaurant_id
    `);
  },


};

module.exports = Reservation;

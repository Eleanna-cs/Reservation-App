const Reservation = require('../models/reservationModel');

exports.createReservation = async (req, res) => {
    const { restaurant_id, date, time, people_count } = req.body;
    const user_id = req.user.user_id;
    try {
        await Reservation.create({ user_id, restaurant_id, date, time, people_count });
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create reservation', error: err });
    }
};

exports.getUserReservations = async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const [rows] = await Reservation.getByUserId(user_id);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch reservations', error: err });
    }
};

exports.updateReservation = async (req, res) => {
  const { date, time, people_count } = req.body;
  const reservation_id = req.params.reservation_id;

  try {
    const [result] = await Reservation.updateById({ reservation_id, date, time, people_count });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reservation', error: err });
  }
};



exports.adminUpdateReservation = async (req, res) => {
  const { reservation_id } = req.params;
  const { date, time, people_count } = req.body;

  try {
    console.log("Updating reservation with:", { reservation_id, date, time, people_count });
    const updated = await Reservation.updateReservationById(reservation_id, {
      date,
      time,
      people_count,
    });

    if (updated.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (err) {
    console.error('Error updating reservation:', err); 
  res.status(500).json({ message: err.message });   
}
};

exports.getReservationById = async (req, res) => {
  const { id } = req.params;

  try {
   const [rows] = await Reservation.getReservationById(id);
    const reservation = rows[0];

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (err) {
    console.error('Error fetching reservation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





exports.deleteReservation = async (req, res) => {
    const { reservation_id } = req.params;
    try {
        await Reservation.deleteById(reservation_id);
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete reservation', error: err });
    }
};


exports.getAllReservations = async (req, res) => {
  try {
    const [reservations] = await Reservation.getAll();
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching all reservations:', err);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};


exports.confirmReservation = async (req, res) => {
  const { reservation_id } = req.params;

  try {
    await Reservation.confirmReservation(reservation_id);
    res.json({ message: 'Reservation confirmed' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ message: 'Failed to confirm reservation' });
  }
};

exports.declineReservation = async (req, res) => {
  const { reservation_id } = req.params;

  try {
    await Reservation.declineReservation(reservation_id);
    res.json({ message: 'Reservation declined' });
  } catch (error) {
    console.error('Error declining reservation:', error);
    res.status(500).json({ message: 'Failed to decline reservation' });
  }
};

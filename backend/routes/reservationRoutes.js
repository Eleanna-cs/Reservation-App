const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');


router.post('/', authMiddleware, reservationController.createReservation);
router.get('/', authMiddleware, reservationController.getUserReservations);
router.get('/all', authMiddleware, authorizeRoles('admin', 'subadmin'), reservationController.getAllReservations);
router.put('/admin/:reservation_id', authMiddleware, authorizeRoles('admin'), reservationController.adminUpdateReservation);
router.get('/:id', authMiddleware, reservationController.getReservationById);
router.put('/:reservation_id', reservationController.updateReservation);  
router.delete('/:reservation_id', authMiddleware, reservationController.deleteReservation);
router.patch('/:reservation_id/confirm', authMiddleware, authorizeRoles('subadmin'), reservationController.confirmReservation);
router.patch('/:reservation_id/decline', authMiddleware, authorizeRoles('subadmin'), reservationController.declineReservation);




module.exports = router;

const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllBookings);
router.put('/cancel/:id', verifyToken, cancelBooking);

module.exports = router;
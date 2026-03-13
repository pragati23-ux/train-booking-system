const express = require('express');
const router = express.Router();
const { createDonation, getMyDonations, getAllDonations } = require('../controllers/donationController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createDonation);
router.get('/my', verifyToken, getMyDonations);
router.get('/all', verifyToken, authorizeRole('ADMIN'), getAllDonations);

module.exports = router;
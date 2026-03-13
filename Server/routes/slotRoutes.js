const express = require('express');
const router = express.Router();
const { getSlotsByTemple, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/:templeId', getSlotsByTemple);
router.post('/', verifyToken, authorizeRole('ADMIN', 'ORGANIZER'), createSlot);
router.put('/:id', verifyToken, authorizeRole('ADMIN', 'ORGANIZER'), updateSlot);
router.delete('/:id', verifyToken, authorizeRole('ADMIN'), deleteSlot);

module.exports = router;
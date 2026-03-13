const express = require('express');
const router = express.Router();
const {
  getAllTemples, getTempleById,
  createTemple, updateTemple, deleteTemple
} = require('../controllers/templeController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllTemples);
router.get('/:id', getTempleById);
router.post('/', verifyToken, authorizeRole('ADMIN', 'ORGANIZER'), upload.single('image'), createTemple);
router.put('/:id', verifyToken, authorizeRole('ADMIN', 'ORGANIZER'), updateTemple);
router.delete('/:id', verifyToken, authorizeRole('ADMIN'), deleteTemple);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor
} = require('../controllers/donorController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET routes: Both 'user' and 'admin' can view donors
router.get('/', authenticate, authorize('user', 'admin'), getAllDonors);
router.get('/:id', authenticate, authorize('user', 'admin'), getDonorById);

// POST, PUT, DELETE: Only 'admin' can create, update, or delete donors
router.post('/', authenticate, authorize('admin'), createDonor);
router.put('/:id', authenticate, authorize('admin'), updateDonor);
router.delete('/:id', authenticate, authorize('admin'), deleteDonor);

module.exports = router;

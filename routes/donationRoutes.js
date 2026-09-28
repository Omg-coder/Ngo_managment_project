const express = require('express');
const router = express.Router();

const {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET routes: Both 'user' and 'admin' can view donations
router.get('/', authenticate, authorize('user', 'admin'), getAllDonations);
router.get('/:id', authenticate, authorize('user', 'admin'), getDonationById);

// POST route: Creating a donation is allowed for BOTH 'user' and 'admin' (Demo donation feature)
router.post('/', authenticate, authorize('user', 'admin'), createDonation);

// PUT and DELETE routes: Only 'admin' can edit or remove donation records
router.put('/:id', authenticate, authorize('admin'), updateDonation);
router.delete('/:id', authenticate, authorize('admin'), deleteDonation);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getAllVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
} = require('../controllers/volunteerController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET routes: Both regular 'user' and 'admin' can view volunteers
router.get('/', authenticate, authorize('user', 'admin'), getAllVolunteers);
router.get('/:id', authenticate, authorize('user', 'admin'), getVolunteerById);

// POST, PUT, DELETE: Only 'admin' can create, update, or remove volunteers
router.post('/', authenticate, authorize('admin'), createVolunteer);
router.put('/:id', authenticate, authorize('admin'), updateVolunteer);
router.delete('/:id', authenticate, authorize('admin'), deleteVolunteer);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET routes: Both 'user' and 'admin' can view events
router.get('/', authenticate, authorize('user', 'admin'), getAllEvents);
router.get('/:id', authenticate, authorize('user', 'admin'), getEventById);

// POST, PUT, DELETE: Only 'admin' can create, update, or remove events
router.post('/', authenticate, authorize('admin'), createEvent);
router.put('/:id', authenticate, authorize('admin'), updateEvent);
router.delete('/:id', authenticate, authorize('admin'), deleteEvent);

module.exports = router;

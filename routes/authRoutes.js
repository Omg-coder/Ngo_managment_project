const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout
} = require('../controllers/authController');

// Route: Register a new user account
// POST /api/auth/register
router.post('/register', register);

// Route: Login and receive access token + refresh token cookie
// POST /api/auth/login
router.post('/login', login);

// Route: Generate a new access token using httpOnly refresh token cookie
// POST /api/auth/refresh
router.post('/refresh', refresh);

// Route: Logout and clear refresh token
// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;

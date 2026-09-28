require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const donorRoutes = require('./routes/donorRoutes');
const donationRoutes = require('./routes/donationRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & Third-Party Middlewares
app.use(express.json()); // Parses JSON incoming request bodies
app.use(cookieParser()); // Parses incoming cookies (used for refresh token)
app.use(cors({
  origin: true,
  credentials: true // Allows browser to receive and send cookies
}));

// Serve static frontend files (simple HTML demo form) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/events', eventRoutes);

// Simple Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'NGO Management API is up and running!' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

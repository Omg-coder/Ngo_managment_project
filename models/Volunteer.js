const mongoose = require('mongoose');

// Volunteer Schema: Stores details of people volunteering for NGO activities
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Volunteer name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  skills: {
    type: [String],
    default: []
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);

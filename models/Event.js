const mongoose = require('mongoose');

// Event Schema: Stores events organized by the NGO and volunteers assigned to them
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  volunteersAssigned: [
    {
      name: {
        type: String,
        required: [true, 'Volunteer name is required']
      },
      role: {
        type: String,
        required: [true, 'Volunteer role is required']
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

// Donor Schema: Stores people or companies who donate funds to the NGO
const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Donor name is required']
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
  type: {
    type: String,
    enum: ['individual', 'corporate'],
    required: [true, 'Donor type is required (individual or corporate)']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);

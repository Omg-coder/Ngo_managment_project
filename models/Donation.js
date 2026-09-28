const mongoose = require('mongoose');

// Donation Schema: Stores donation records made by donors
const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: false
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  mode: {
    type: String,
    enum: ['cash', 'online', 'cheque'],
    required: [true, 'Payment mode is required (cash, online, or cheque)']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);

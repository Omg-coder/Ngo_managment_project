const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const User = require('../models/User');

// 1. GET ALL DONATIONS
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// 2. GET SINGLE DONATION BY ID
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};

// 3. CREATE A NEW DONATION (Demo feature: supports custom donor name for admin or auto-link for user)
const createDonation = async (req, res) => {
  try {
    let { donorId, donorName, amount, mode, date } = req.body;

    // 1. If admin provided a specific donor name (can be anyone)
    if (donorName && donorName.trim() && !donorId) {
      const trimmedName = donorName.trim();
      let donor = await Donor.findOne({ name: trimmedName });
      if (!donor) {
        // Auto-create donor entry for this new name
        const cleanSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'donor';
        donor = await Donor.create({
          name: trimmedName,
          email: `${cleanSlug}@donor.ngo`,
          phone: 'N/A',
          type: 'individual'
        });
      }
      donorId = donor._id;
    }

    // 2. If neither donorId nor donorName was provided, auto-link to authenticated user
    if (!donorId && req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      const userName = user ? user.name : (req.user.email || 'Community Contributor');
      const userEmail = user ? user.email : (req.user.email || 'contributor@ngo.org');

      // Check if a donor profile already exists for this email
      let donor = await Donor.findOne({ email: userEmail });
      if (!donor) {
        donor = await Donor.create({
          name: userName,
          email: userEmail,
          phone: 'N/A',
          type: 'individual'
        });
      }
      donorId = donor._id;
    }

    const newDonation = await Donation.create({
      donorId: donorId || null,
      amount,
      mode,
      date: date || Date.now()
    });

    res.status(201).json({
      message: 'Donation recorded successfully!',
      donation: newDonation
    });
  } catch (error) {
    res.status(400).json({ message: 'Error recording donation', error: error.message });
  }
};

// 4. UPDATE A DONATION BY ID
const updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json({
      message: 'Donation updated successfully!',
      donation: updatedDonation
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donation', error: error.message });
  }
};

// 5. DELETE A DONATION BY ID
const deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    if (!deletedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json({ message: 'Donation deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donation', error: error.message });
  }
};

module.exports = {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation
};

const Donor = require('../models/Donor');

// 1. GET ALL DONORS
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
};

// 2. GET SINGLE DONOR BY ID
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor', error: error.message });
  }
};

// 3. CREATE A NEW DONOR
const createDonor = async (req, res) => {
  try {
    const { name, email, phone, type } = req.body;
    const newDonor = await Donor.create({
      name,
      email,
      phone,
      type
    });
    res.status(201).json({
      message: 'Donor created successfully!',
      donor: newDonor
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating donor', error: error.message });
  }
};

// 4. UPDATE A DONOR BY ID
const updateDonor = async (req, res) => {
  try {
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({
      message: 'Donor updated successfully!',
      donor: updatedDonor
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donor', error: error.message });
  }
};

// 5. DELETE A DONOR BY ID
const deleteDonor = async (req, res) => {
  try {
    const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
    if (!deletedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donor', error: error.message });
  }
};

module.exports = {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor
};

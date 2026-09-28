const Volunteer = require('../models/Volunteer');

// 1. GET ALL VOLUNTEERS
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers', error: error.message });
  }
};

// 2. GET SINGLE VOLUNTEER BY ID
const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.status(200).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer', error: error.message });
  }
};

// 3. CREATE A NEW VOLUNTEER
const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;
    const newVolunteer = await Volunteer.create({
      name,
      email,
      phone,
      skills
    });
    res.status(201).json({
      message: 'Volunteer created successfully!',
      volunteer: newVolunteer
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating volunteer', error: error.message });
  }
};

// 4. UPDATE A VOLUNTEER BY ID
const updateVolunteer = async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // { new: true } returns the updated document
    );
    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.status(200).json({
      message: 'Volunteer updated successfully!',
      volunteer: updatedVolunteer
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating volunteer', error: error.message });
  }
};

// 5. DELETE A VOLUNTEER BY ID
const deleteVolunteer = async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.status(200).json({ message: 'Volunteer deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteer', error: error.message });
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
};

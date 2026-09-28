const Event = require('../models/Event');

// 1. GET ALL EVENTS
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// 2. GET SINGLE EVENT BY ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// 3. CREATE A NEW EVENT
const createEvent = async (req, res) => {
  try {
    const { title, date, location, volunteersAssigned } = req.body;
    const newEvent = await Event.create({
      title,
      date,
      location,
      volunteersAssigned: volunteersAssigned || []
    });
    res.status(201).json({
      message: 'Event created successfully!',
      event: newEvent
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
};

// 4. UPDATE AN EVENT BY ID
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({
      message: 'Event updated successfully!',
      event: updatedEvent
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
};

// 5. DELETE AN EVENT BY ID
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

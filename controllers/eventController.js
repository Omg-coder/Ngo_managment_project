const db = require('../db');

// Helper to format event row for frontend compatibility
const formatEvent = (row) => ({
  id: row.id,
  _id: row.id.toString(),
  title: row.title,
  date: row.date,
  location: row.location,
  volunteersAssigned: row.volunteers_assigned || [],
  createdAt: row.created_at
});

// 1. GET ALL EVENTS
const getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY date ASC');
    res.status(200).json(result.rows.map(formatEvent));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// 2. GET SINGLE EVENT BY ID
const getEventById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(formatEvent(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// 3. CREATE A NEW EVENT
const createEvent = async (req, res) => {
  try {
    const { title, date, location, volunteersAssigned } = req.body;

    const query = `
      INSERT INTO events (title, date, location, volunteers_assigned)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [
      title,
      date,
      location,
      JSON.stringify(volunteersAssigned || [])
    ]);

    const newEvent = formatEvent(result.rows[0]);

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
    const { title, date, location, volunteersAssigned } = req.body;
    const jsonVolunteers = volunteersAssigned !== undefined ? JSON.stringify(volunteersAssigned) : null;

    const query = `
      UPDATE events
      SET title = COALESCE($1, title),
          date = COALESCE($2, date),
          location = COALESCE($3, location),
          volunteers_assigned = COALESCE($4, volunteers_assigned)
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [title, date, location, jsonVolunteers, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event updated successfully!',
      event: formatEvent(result.rows[0])
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
};

// 5. DELETE AN EVENT BY ID
const deleteEvent = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
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

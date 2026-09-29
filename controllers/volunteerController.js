const db = require('../db');

// Helper to format volunteer row for frontend compatibility
const formatVolunteer = (row) => ({
  id: row.id,
  _id: row.id.toString(),
  name: row.name,
  email: row.email,
  phone: row.phone,
  skills: Array.isArray(row.skills) ? row.skills : [],
  joinedDate: row.joined_date
});

// 1. GET ALL VOLUNTEERS
const getAllVolunteers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM volunteers ORDER BY id DESC');
    const formatted = result.rows.map(formatVolunteer);
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers', error: error.message });
  }
};

// 2. GET SINGLE VOLUNTEER BY ID
const getVolunteerById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM volunteers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.status(200).json(formatVolunteer(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer', error: error.message });
  }
};

// 3. CREATE A NEW VOLUNTEER
const createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;
    const skillsArray = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);

    const query = `
      INSERT INTO volunteers (name, email, phone, skills)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [name, email, phone, skillsArray]);
    const newVolunteer = formatVolunteer(result.rows[0]);

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
    const { name, email, phone, skills } = req.body;
    const skillsArray = skills !== undefined 
      ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) 
      : null;

    const query = `
      UPDATE volunteers
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          skills = COALESCE($4, skills)
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [name, email, phone, skillsArray, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json({
      message: 'Volunteer updated successfully!',
      volunteer: formatVolunteer(result.rows[0])
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating volunteer', error: error.message });
  }
};

// 5. DELETE A VOLUNTEER BY ID
const deleteVolunteer = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM volunteers WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
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

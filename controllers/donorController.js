const db = require('../db');

// Helper to format donor row for frontend compatibility
const formatDonor = (row) => ({
  id: row.id,
  _id: row.id.toString(),
  name: row.name,
  email: row.email,
  phone: row.phone,
  type: row.type,
  createdAt: row.created_at
});

// 1. GET ALL DONORS
const getAllDonors = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donors ORDER BY id DESC');
    res.status(200).json(result.rows.map(formatDonor));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
};

// 2. GET SINGLE DONOR BY ID
const getDonorById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donors WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(formatDonor(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor', error: error.message });
  }
};

// 3. CREATE A NEW DONOR
const createDonor = async (req, res) => {
  try {
    const { name, email, phone, type } = req.body;

    const query = `
      INSERT INTO donors (name, email, phone, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [name, email, phone, type || 'individual']);
    const newDonor = formatDonor(result.rows[0]);

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
    const { name, email, phone, type } = req.body;

    const query = `
      UPDATE donors
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          type = COALESCE($4, type)
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [name, email, phone, type, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json({
      message: 'Donor updated successfully!',
      donor: formatDonor(result.rows[0])
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donor', error: error.message });
  }
};

// 5. DELETE A DONOR BY ID
const deleteDonor = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM donors WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
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

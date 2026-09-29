const db = require('../db');

// Helper to format donation row for frontend compatibility
const formatDonation = (row) => ({
  id: row.id,
  _id: row.id.toString(),
  donorId: row.donor_id ? row.donor_id.toString() : null,
  amount: Number(row.amount),
  mode: row.mode,
  date: row.date
});

// 1. GET ALL DONATIONS
const getAllDonations = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donations ORDER BY id DESC');
    res.status(200).json(result.rows.map(formatDonation));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// 2. GET SINGLE DONATION BY ID
const getDonationById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM donations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json(formatDonation(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};

// 3. CREATE A NEW DONATION (Supports custom donorName for Admin, auto-link for User)
const createDonation = async (req, res) => {
  try {
    let { donorId, donorName, amount, mode, date } = req.body;

    // 1. If admin provided a specific donor name
    if (donorName && donorName.trim() && !donorId) {
      const trimmedName = donorName.trim();
      const donorCheck = await db.query('SELECT id FROM donors WHERE name = $1 LIMIT 1', [trimmedName]);

      if (donorCheck.rows.length > 0) {
        donorId = donorCheck.rows[0].id;
      } else {
        const cleanSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'donor';
        const newDonor = await db.query(
          'INSERT INTO donors (name, email, phone, type) VALUES ($1, $2, $3, $4) RETURNING id',
          [trimmedName, `${cleanSlug}@donor.ngo`, 'N/A', 'individual']
        );
        donorId = newDonor.rows[0].id;
      }
    }

    // 2. If no donorId or donorName, auto-link to authenticated user
    if (!donorId && req.user && req.user.id) {
      const userResult = await db.query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
      const user = userResult.rows[0];
      const userName = user ? user.name : (req.user.email || 'Community Contributor');
      const userEmail = user ? user.email : (req.user.email || 'contributor@ngo.org');

      const donorCheck = await db.query('SELECT id FROM donors WHERE email = $1 LIMIT 1', [userEmail]);
      if (donorCheck.rows.length > 0) {
        donorId = donorCheck.rows[0].id;
      } else {
        const newDonor = await db.query(
          'INSERT INTO donors (name, email, phone, type) VALUES ($1, $2, $3, $4) RETURNING id',
          [userName, userEmail, 'N/A', 'individual']
        );
        donorId = newDonor.rows[0].id;
      }
    }

    // Convert donorId to number if valid integer
    const parsedDonorId = donorId ? parseInt(donorId, 10) : null;

    const insertQuery = `
      INSERT INTO donations (donor_id, amount, mode, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      isNaN(parsedDonorId) ? null : parsedDonorId,
      amount,
      mode,
      date || new Date()
    ]);

    const newDonation = formatDonation(result.rows[0]);

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
    const { amount, mode } = req.body;

    const query = `
      UPDATE donations
      SET amount = COALESCE($1, amount),
          mode = COALESCE($2, mode)
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [amount, mode, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json({
      message: 'Donation updated successfully!',
      donation: formatDonation(result.rows[0])
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating donation', error: error.message });
  }
};

// 5. DELETE A DONATION BY ID
const deleteDonation = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM donations WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
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

const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to format user response
const formatUser = (user) => ({
  id: user.id,
  _id: user.id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

// 1. REGISTER: Creates a new user in PostgreSQL
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    const insertQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      role || 'user'
    ]);

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'User registered successfully!',
      user: formatUser(newUser)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// 2. LOGIN: Authenticates user and issues access & refresh tokens
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Find user by email in PostgreSQL
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Token payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Short-lived Access Token (15 min)
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });

    // Long-lived Refresh Token (7 days)
    const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    // Store refresh token in PostgreSQL
    await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful!',
      accessToken,
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// 3. REFRESH: Generates a new access token using the stored refresh token cookie
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found in cookies.' });
    }

    // Find user by refresh token in PostgreSQL
    const result = await db.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid or expired refresh token session.' });
    }

    const user = result.rows[0];

    // Verify token signature
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.status(200).json({
        message: 'New access token generated successfully!',
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token', error: error.message });
  }
};

// 4. LOGOUT: Clears refresh token from DB and removes cookie
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await db.query('UPDATE users SET refresh_token = $1 WHERE refresh_token = $2', ['', refreshToken]);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax'
    });

    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};

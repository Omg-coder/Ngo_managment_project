const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER: Creates a new user in the database
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if email already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password using bcrypt with salt factor 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // Default to 'user' if not specified
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// 2. LOGIN: Authenticates user and issues access & refresh tokens
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare plain password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Payload for JWT tokens
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    // Generate short-lived Access Token (15 minutes)
    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });

    // Generate long-lived Refresh Token (7 days)
    const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    // Store the refresh token in the user's document in MongoDB
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token as an httpOnly cookie (cannot be accessed via client JavaScript)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Send access token and basic user info in JSON response body
    res.status(200).json({
      message: 'Login successful!',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// 3. REFRESH: Generates a new access token using the stored refresh token cookie
const refresh = async (req, res) => {
  try {
    // Read the refreshToken from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found in cookies.' });
    }

    // Find the user with this refresh token in the database
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid or expired refresh token session.' });
    }

    // Verify refresh token signature
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }

      // Generate a new 15-minute access token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
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
      // Find the user and remove their stored refresh token in DB
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
    }

    // Clear the cookie from client's browser
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

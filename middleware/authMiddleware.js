const jwt = require('jsonwebtoken');

// Middleware 1: authenticate
// This function checks if the user provided a valid JWT access token in the Authorization header
const authenticate = (req, res, next) => {
  // 1. Get the Authorization header from incoming HTTP request
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  // 2. Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No access token provided.' });
  }

  // 3. Extract the token by removing "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 5. Attach user info (id, email, role) to the request object so future routes can use it
    req.user = decoded;

    // 6. Move to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token.' });
  }
};

// Middleware 2: authorize
// This function checks if the logged-in user's role matches the allowed roles for this route
// Example usage: authorize('admin') or authorize('user', 'admin')
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Check if user is authenticated and attached to req
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access forbidden. User role not identified.' });
    }

    // 2. Check if the user's role is included in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Only ${allowedRoles.join(', ')} can perform this action.`
      });
    }

    // 3. If role matches, proceed
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};

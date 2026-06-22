// backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify the logged-in user
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the incoming HTTP request headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string (Remove the word "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using our hidden JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from DB associated with this token (excluding password) and attach to req.user
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        const error = new Error('The user belonging to this token no longer exists.');
        error.status = 401;
        return next(error);
      }

      // Everything looks great! Move forward to the controller action
      return next();
    } catch (error) {
      const authError = new Error('Not authorized, token invalid or expired');
      authError.status = 401;
      return next(authError);
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token security header found');
    error.status = 401;
    return next(error);
  }
};

// Role-Based Access Control (RBAC) closure middleware
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user was attached by the previous protect middleware
    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error('Forbidden: You do not have permission to perform this action');
      error.status = 403; // 403 means Forbidden
      return next(error);
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
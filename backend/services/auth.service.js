// backend/services/auth.service.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token remains valid for 30 days
  });
};

const registerUser = async (userData) => {
  const { name, email, password, role, roleDetails } = userData;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists with this email');
    error.status = 400;
    throw error;
  }

  // 2. Extra Validation: Enforce jurisdiction for police or bank code for bank admins
  if (role === 'police') {
    if (!roleDetails?.jurisdiction?.district || !roleDetails?.jurisdiction?.stationName) {
      const error = new Error('Police officers must provide district and station name');
      error.status = 400;
      throw error;
    }
  } else if (role === 'bank_admin') {
    if (!roleDetails?.bankCode) {
      const error = new Error('Bank administrators must provide a valid Bank Code');
      error.status = 400;
      throw error;
    }
  }

  // 3. Create the user (Password hashing is handled automatically by our model pre-save hook!)
  const user = await User.create({
    name,
    email,
    password,
    role,
    roleDetails: role === 'victim' ? undefined : roleDetails, // Keep victim documents clean
  });

  // 4. Return user info along with their access token
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

const loginUser = async (email, password) => {
  // Explicitly select password since it's hidden by default in our schema
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.status = 401; // Unauthorized
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

module.exports = {
  registerUser,
  loginUser,
};
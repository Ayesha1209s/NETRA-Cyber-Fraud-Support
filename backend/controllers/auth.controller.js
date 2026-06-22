// backend/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const register = async (req, res, next) => {
  try {
    // Validate request body data against Zod schema rules
    const validatedData = registerSchema.parse(req.body);

    // Call service layer to handle database insertion
    const result = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    // Passes any caught errors (including Zod validation errors) directly to our centralized error handler
    next(error); 
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
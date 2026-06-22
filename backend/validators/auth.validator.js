// backend/validators/auth.validator.js
const { z } = require('zod');

// Schema for User Registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['victim', 'police', 'bank_admin'], {
    errorMap: () => ({ message: "Role must be 'victim', 'police', or 'bank_admin'" }),
  }),
  // roleDetails is optional overall, but we will check its contents conditionally later
  roleDetails: z.object({
    jurisdiction: z.object({
      district: z.string().optional(),
      stationName: z.string().optional(),
    }).optional(),
    bankCode: z.string().optional(),
  }).optional(),
});

// Schema for User Login
const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
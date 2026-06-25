// backend/validators/complaint.validator.js
const { z } = require('zod');

const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').trim(),
  description: z.string().min(20, 'Please provide a more detailed description (min 20 characters)'),
  transactions: z.array(
    z.object({
      transactionId: z.string().min(1, 'Transaction Reference/UTR number is required').trim(),
      amount: z.number().positive('Amount must be greater than zero'),
      bankName: z.string().min(2, 'Bank name is required').toUpperCase().trim(),
      accountNumber: z.string().min(5, 'Account number must be valid'),
    })
  ).min(1, 'At least one fraudulent transaction must be reported'),
});

module.exports = {
  createComplaintSchema,
};
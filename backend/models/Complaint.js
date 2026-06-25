// backend/models/Complaint.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: [true, 'Transaction reference ID/UTR is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [1, 'Amount must be greater than 0'],
  },
  bankName: {
    type: String,
    required: [true, 'Target bank name is required'], // e.g., 'SBI', 'HDFC'
  },
  accountNumber: {
    type: String,
    required: [true, 'Fraudulent/Mule account number is required'],
  },
  freezeStatus: {
    type: String,
    enum: ['pending', 'requested', 'frozen', 'failed'],
    default: 'pending',
  },
});

const ComplaintSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true, // e.g., NETRA-OD-2026-100432
    },
    victimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please provide a brief title for the fraud'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please detail how the cyber fraud occurred'],
    },
    transactions: [TransactionSchema], // Embedded array for multi-hop tracking
    status: {
      type: String,
      enum: ['filed', 'under_investigation', 'bank_notified', 'funds_frozen', 'refund_initiated', 'resolved'],
      default: 'filed',
    },
    evidenceUrls: [String], // Array of AWS S3 file links (screenshots/receipts)
    statusHistory: [
      {
        status: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
        remarks: String,
      },
    ],
  },
  { timestamps: true }
);

// Indexing for quick lookups in large regional databases

ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ 'transactions.bankName': 1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
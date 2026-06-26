// backend/services/complaint.service.js
const Complaint = require('../models/Complaint');
const generateCaseId = require('../utils/caseIdGenerator');

const fileNewComplaint = async (victimId, complaintData) => {
  const { title, description, transactions } = complaintData;

  // 1. Generate a brand new, unique identifier
  const caseId = generateCaseId();

  // 2. Initialize the historical tracking log array
  const statusHistory = [
    {
      status: 'filed',
      updatedBy: victimId,
      remarks: 'Complaint lodged successfully by victim via the NETRA portal.',
    },
  ];

  // 3. Build and execute document creation
  const newComplaint = await Complaint.create({
    caseId,
    victimId,
    title,
    description,
    transactions,
    statusHistory,
  });

  return newComplaint;
};

// Add this to the bottom of backend/services/complaint.service.js

const getPoliceDashboardQueue = async (officerDistrict) => {
  // Find all complaints where we can map workflows or filter fields.
  // In an advanced version, you can match victim districts, but for our workflow, 
  // we will pull complaints matching unassigned or regional criteria.
  // Let's grab all active cases that are filed or under investigation to populate their queue.
  const queue = await Complaint.find({
    status: { $in: ['filed', 'under_investigation', 'bank_notified'] }
  })
  .populate('victimId', 'name email') // Join user collection to get victim details smoothly
  .sort({ createdAt: -1 }); // Newest complaints first

  return queue;
};

// Add this to the bottom of backend/services/complaint.service.js

const requestTransactionFreeze = async (caseId, transactionId, officerId, remarks) => {
  // 1. Locate the complaint matching the custom tracking ID
  const complaint = await Complaint.findOne({ caseId });
  if (!complaint) {
    const error = new Error('Complaint record not found');
    error.status = 404;
    throw error;
  }

  // 2. Locate the specific target transaction within the embedded array
  const transaction = complaint.transactions.find(
    (tx) => tx.transactionId === transactionId
  );

  if (!transaction) {
    const error = new Error('Transaction UTR reference not found in this case file');
    error.status = 404;
    throw error;
  }

  // 3. Update the transaction state to "requested"
  transaction.freezeStatus = 'requested';

  // 4. Update overall case status to reflect bank notification progress
  complaint.status = 'bank_notified';

  // 5. Push a tracking event record into the history log
  complaint.statusHistory.push({
    status: 'bank_notified',
    updatedBy: officerId,
    remarks: `Freeze notification dispatched for Transaction UTR: ${transactionId}. Reason: ${remarks || 'Investigation ongoing.'}`,
  });

  // Save the complete parent document updates back to Atlas
  await complaint.save();
  return complaint;
};

module.exports = {
  fileNewComplaint,
  getPoliceDashboardQueue,
  requestTransactionFreeze, // Make sure to export this new method!
};
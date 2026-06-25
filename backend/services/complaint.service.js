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

module.exports = {
  fileNewComplaint,
};
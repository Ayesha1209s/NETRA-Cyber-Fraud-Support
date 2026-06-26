// backend/controllers/complaint.controller.js
const complaintService = require('../services/complaint.service');
const { createComplaintSchema } = require('../validators/complaint.validator');

const fileComplaint = async (req, res, next) => {
  try {
    // 1. Parse request contents against Zod rules
    const validatedData = createComplaintSchema.parse(req.body);

    // 2. Pass down to service layer with authenticated victim ID
    const complaint = await complaintService.fileNewComplaint(req.user._id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Cyber fraud complaint logged securely under case history.',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};


// 🌟 NEW: Get all complaints for the police officer's queue
const getPoliceQueue = async (req, res, next) => {
  try {
    // Extract the officer's district from their JWT-decoded profile object
    const district = req.user.roleDetails?.jurisdiction?.district;
    
    const cases = await complaintService.getPoliceDashboardQueue(district);

    res.status(200).json({
      success: true,
      count: cases.length,
      message: `Active cyber fraud incident queue retrieved for district: ${district || 'All'}`,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
};

// Add this to backend/controllers/complaint.controller.js

const processFreezeRequest = async (req, res, next) => {
  try {
    const { caseId, transactionId, remarks } = req.body;

    if (!caseId || !transactionId) {
      const error = new Error('Missing caseId or transactionId parameters');
      error.status = 400;
      throw error;
    }

    // Call service layer passing the actioning officer's ID from their JWT token
    const updatedComplaint = await complaintService.requestTransactionFreeze(
      caseId,
      transactionId,
      req.user._id,
      remarks
    );

    res.status(200).json({
      success: true,
      message: 'Bank formal freeze notification logged and timeline tracking updated.',
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fileComplaint,
  getPoliceQueue,
  processFreezeRequest, // Export it!
};
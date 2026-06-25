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

module.exports = {
  fileComplaint,
};
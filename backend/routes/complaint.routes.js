// backend/routes/complaint.routes.js
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Secure Route: Must be logged in AND must be a registered victim to lodge complaints
router.post('/file', protect, restrictTo('victim'), complaintController.fileComplaint);

module.exports = router;
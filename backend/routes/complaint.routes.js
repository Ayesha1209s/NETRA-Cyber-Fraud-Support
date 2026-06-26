// backend/routes/complaint.routes.js
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware'); // 🌟 Import upload middleware here

// Existing routes
router.post('/file', protect, restrictTo('victim'), complaintController.fileComplaint);
router.get('/police/queue', protect, restrictTo('police'), complaintController.getPoliceQueue);
router.patch('/police/freeze-request', protect, restrictTo('police'), complaintController.processFreezeRequest);

// 🌟 NEW: Multipart Form-Data upload gate for evidence files
// 'evidence' is the key name we will pass inside Postman's form field body
router.post('/upload-evidence', protect, restrictTo('victim'), upload.single('evidence'), complaintController.uploadEvidence);

module.exports = router;
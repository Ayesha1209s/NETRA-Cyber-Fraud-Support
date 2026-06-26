// backend/routes/complaint.routes.js
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Victim Route
router.post('/file', protect, restrictTo('victim'), complaintController.fileComplaint);

// 🌟 NEW: Police Route (Guarded strictly for police users)
router.get('/police/queue', protect, restrictTo('police'), complaintController.getPoliceQueue);
// 🌟 NEW: Police action route to trigger a freeze request
router.patch('/police/freeze-request', protect, restrictTo('police'), complaintController.processFreezeRequest);

module.exports = router;
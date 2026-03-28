const express = require('express');
const router = express.Router();
const { verifyDeposit, releaseFunds, getEscrowStats } = require('../controllers/escrowController');
const { protect, authorize } = require('../middleware/auth'); // Your existing auth middleware



router.get('/all', protect,authorize('admin'), getEscrowStats);
router.put('/verify-deposit/:orderId', protect,authorize('admin'), verifyDeposit);
router.put('/release-funds/:orderId', protect,authorize('admin'), releaseFunds);

module.exports = router;
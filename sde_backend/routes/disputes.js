const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createDispute,
  getDisputes,
  getDispute,
  updateDispute,
  markFinanceNotified
} = require('../controllers/disputeController');

router.post('/create', protect, createDispute);
router.get('/', protect, getDisputes);
router.get('/:id', protect, getDispute);
router.put('/:id', protect, updateDispute);
router.put('/:id/finance-notify', protect, authorize('admin'), markFinanceNotified);

module.exports = router;

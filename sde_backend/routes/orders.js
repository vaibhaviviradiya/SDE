const express = require('express');
const router = express.Router();
const { createOrder, updatePaymentStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
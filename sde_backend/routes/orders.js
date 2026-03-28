const express = require('express');
const router = express.Router();
const { createOrder, updatePaymentStatus ,getOrderDetails ,allorders  } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.put('/:id/payment', protect, updatePaymentStatus);
router.get('/:id/order-details', protect, getOrderDetails);
router.get('/allorders', protect, allorders);

module.exports = router;
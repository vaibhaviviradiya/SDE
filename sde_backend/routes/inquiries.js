const express = require('express');
const router = express.Router();
const { createInquiry, getSellerInquiries, updateInquiryStatus, getDiamondInquiries } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Buyer offer bhej sakta hai
router.post('/send', protect, authorize('buyer', 'trader'), createInquiry);

// Seller apne offers dekh sakta hai
router.get('/my-offers', protect, authorize('manufacturer', 'trader'), getSellerInquiries);

// Seller/Admin: specific diamond ka inquiries dekhne ke liye
router.get('/diamond/:diamondId', protect, getDiamondInquiries);

// Seller status update kar sakta hai (Accept/Reject)
router.put('/:id/status', protect, updateInquiryStatus);

module.exports = router;
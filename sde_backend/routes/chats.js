const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Message bhejna (Protected)
router.post('/send', protect, sendMessage);

// Chat history dekhna (Protected)
router.get('/:inquiryId', protect, getChatHistory);

module.exports = router;
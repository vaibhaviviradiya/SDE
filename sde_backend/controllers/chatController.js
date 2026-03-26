const Chat = require('../models/chat');
const Inquiry = require('../models/inquiry');

// @desc    Message bhejne ke liye
exports.sendMessage = async (req, res) => {
  try {
    const { inquiryId, receiverId, message } = req.body;

    // Check karo ki ye inquiry valid hai ya nahi
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    const chat = new Chat({
      inquiryId,
      senderId: req.user.id, // Logged-in user
      receiverId,
      message
    });

    await chat.save();
    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Kisi specific Inquiry ki saari chat history dekhne ke liye
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ inquiryId: req.params.inquiryId })
      .sort({ timestamp: 1 }) // Purane message pehle, naye baad mein
      .populate('senderId', 'ownerName role');

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
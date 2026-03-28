const Inquiry = require('../models/inquiry');
const Diamond = require('../models/diamond');

// @desc    Naya offer/inquiry bhejne ke liye (Sirf Buyer/Trader)
exports.createInquiry = async (req, res) => {
  try {
    const { diamondId, offeredPrice, message } = req.body;

    // 1. Pehle check karo diamond exist karta hai ya nahi
    const diamond = await Diamond.findById(diamondId);
    if (!diamond) return res.status(404).json({ message: "Diamond not found" });

    // 2. Inquiry create karo
    const inquiry = new Inquiry({
      diamondId,
      buyerId: req.user.id, // Logged-in Buyer
      sellerId: diamond.sellerId, // Diamond ka asli malik
      offeredPrice,
      message
    });

    await inquiry.save();
    res.status(201).json({ success: true, message: "Offer sent to seller!", data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Seller apne diamonds par aaye saare offers dekh sakega
exports.getSellerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sellerId: req.user.id })
      .populate('buyerId', 'companyName ownerName trustScore')
      .populate('diamondId', 'shape carat color price');

    res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Admin ke liye saare inquiries dekhne ke liye
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('buyerId', 'companyName ownerName role')
      .populate('sellerId', 'companyName ownerName role')
      .populate('diamondId', 'shape carat color price');

    res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Kisi specific diamond ke liye inquiries (seller/admin may access)
exports.getDiamondInquiries = async (req, res) => {
  try {
    const { id: diamondId } = req.params;
    const diamond = await Diamond.findById(diamondId);
    if (!diamond) return res.status(404).json({ message: 'Diamond not found' });

    if (req.user.role !== 'admin' && diamond.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this diamond inquiries' });
    }

    const inquiries = await Inquiry.find({ diamondId })
      .populate('buyerId', 'companyName ownerName trustScore')
      .populate('sellerId', 'companyName ownerName')
      .populate('diamondId', 'shape carat color price');

    res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Offer ko Accept ya Reject karne ke liye
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    
    // Debugging ke liye: Terminal check karein ki 'accepted' aa raha hai ya nahi
    console.log("Status received from frontend:", status);

    // Check ki status valid hai ya nahi
    const validStatuses = ['accepted', 'rejected', 'pending'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or missing status. Must be 'accepted' or 'rejected'." 
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    // Ensure ki sirf seller hi status update kar sake
    if (inquiry.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this offer" });
    }

    inquiry.currentStatus = status;
    await inquiry.save();

    res.status(200).json({ 
      success: true, 
      message: `Offer ${status} successfully`, 
      data: inquiry 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
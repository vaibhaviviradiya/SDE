const Order = require('../models/order');
const Diamond = require('../models/diamond');
const Inquiry = require('../models/inquiry');

// @desc    Naya Order create karne ke liye (Jab seller offer accept kare)
exports.createOrder = async (req, res) => {
  try {
    const { inquiryId } = req.body;

    // 1. Inquiry details nikalo
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry || inquiry.currentStatus !== 'accepted') {
      return res.status(400).json({ message: "Inquiry must be accepted to create an order" });
    }

    // 2. Naya Order object banao
    const order = new Order({
      diamondId: inquiry.diamondId,
      buyerId: inquiry.buyerId,
      sellerId: inquiry.sellerId,
      agreedPrice: inquiry.offeredPrice,
      paymentStatus: 'pending', // Abhi paise nahi aaye
      orderStatus: 'processing'
    });

    await order.save();

    // 3. Diamond ka status 'reserved' kar do taaki koi aur na khareed sake
    await Diamond.findByIdAndUpdate(inquiry.diamondId, { status: 'reserved' });

    res.status(201).json({ success: true, message: "Order created! Proceed to escrow payment.", data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Payment Status update karne ke liye (Simulating Escrow)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'escrow' (paise deposit hue) or 'completed' (seller ko mile)
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: status }, { new: true });
    
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
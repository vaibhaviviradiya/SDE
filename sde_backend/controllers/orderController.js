const Order = require('../models/order');
const Diamond = require('../models/diamond');
const Inquiry = require('../models/inquiry');

// @desc    Naya Order create karne ke liye (Jab seller offer accept kare)
exports.createOrder = async (req, res) => {
  try {
    const { inquiryId } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);
    
    // Check if inquiry exists and is NOT already closed
    if (!inquiry || inquiry.isClosed) {
      return res.status(400).json({ message: "Inquiry is already closed or not found" });
    }

    // 1. Naya Order object banao
    const order = new Order({
      diamondId: inquiry.diamondId,
      buyerId: inquiry.buyerId,
      sellerId: inquiry.sellerId,
      agreedPrice: inquiry.offeredPrice,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    await order.save();

    // 2. Diamond status update
    await Diamond.findByIdAndUpdate(inquiry.diamondId, { status: 'reserved' });

    // 3. AUTOMATIC UPDATE: Inquiry ko yahan close aur accept mark karo
    await Inquiry.findByIdAndUpdate(inquiryId, { 
      currentStatus: 'accepted', 
      isClosed: true 
    });

    res.status(201).json({ 
      success: true, 
      message: "Order created and Inquiry finalized!", 
      data: order 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// @desc    Payment Status update karne ke liye (Simulating Escrow)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: status }, { new: true });

    // Agar Admin ne paise Seller ko release kar diye (deal khatam)
    if (status === 'completed') {
      await Diamond.findByIdAndUpdate(order.diamondId, { status: 'sold' });
    }
    
    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
//single order details ke liye
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('diamondId')
      .populate('buyerId', 'companyName ownerName trustScore')
      .populate('sellerId', 'companyName ownerName trustScore');
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } 
};

exports.allorders = async (req, res) => {
  try {
    const orders = await Order.find() 
      .populate('diamondId')
      .populate('buyerId', 'companyName ownerName trustScore')
      .populate('sellerId', 'companyName ownerName trustScore');
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const Dispute = require('../models/dispute');
const Order = require('../models/order');

// Create a dispute
exports.createDispute = async (req, res) => {
  try {
    const { orderId, reason, details, attachments } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Determine raisedAgainst: if requester is buyer -> seller, else buyer
    const raisedBy = req.user.id;
    const raisedAgainst = (order.buyerId.toString() === raisedBy) ? order.sellerId : order.buyerId;

    const dispute = new Dispute({
      orderId,
      raisedBy,
      raisedAgainst,
      reason,
      details,
      attachments
    });

    await dispute.save();
    res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all disputes (admin) or disputes for current user
exports.getDisputes = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { $or: [{ raisedBy: req.user.id }, { raisedAgainst: req.user.id }] };
    }
    const disputes = await Dispute.find(query)
      .populate('orderId')
      .populate('raisedBy', 'companyName ownerName')
      .populate('raisedAgainst', 'companyName ownerName')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: disputes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single dispute
exports.getDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('orderId')
      .populate('raisedBy', 'companyName ownerName')
      .populate('raisedAgainst', 'companyName ownerName');
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.status(200).json({ success: true, data: dispute });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update dispute status or resolution
exports.updateDispute = async (req, res) => {
  try {
    const updates = req.body;
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.status(200).json({ success: true, data: dispute });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mark finance notified (simple flag)
exports.markFinanceNotified = async (req, res) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, { financeNotified: true }, { new: true });
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    // In future: emit notification or create Notification model record
    res.status(200).json({ success: true, data: dispute, message: 'Finance notified' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

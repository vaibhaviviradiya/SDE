const Order = require('../models/order');
const Diamond = require('../models/diamond');


exports.verifyDeposit = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Update status to escrow_deposited
        order.paymentStatus = 'escrow_deposited';
        // You can also save the Admin ID who verified this
        order.adminVerifiedBy = req.user.id; 
        
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment verified. Funds are now held in Escrow.",
            data: order
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


exports.releaseFunds = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.paymentStatus !== 'escrow_deposited') {
            return res.status(400).json({ 
                success: false, 
                message: "Funds must be in Escrow before they can be released." 
            });
        }

        // 1. Update Order Status
        order.paymentStatus = 'completed';
        order.orderStatus = 'delivered';
        await order.save();

        // 2. Automatically mark the Diamond as SOLD in the marketplace
        await Diamond.findByIdAndUpdate(order.diamondId, { 
            status: 'sold',
            isAvailable: false 
        });

        res.status(200).json({
            success: true,
            message: "Funds released to Seller. Diamond marked as SOLD.",
            data: order
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get all Escrow-related transactions for the Admin Panel
 * @route   GET /api/escrow/all
 */
exports.getEscrowStats = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('diamondId', 'carat shape price')
            .populate('buyerId', 'ownerName companyName')
            .populate('sellerId', 'ownerName companyName');

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  diamondId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diamond', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agreedPrice: { type: Number, required: true },
  
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'escrow', 'completed', 'refunded'] // Safe with Admin logic[cite: 3]
  },
  orderStatus: { 
    type: String, 
    required: true, 
    enum: ['processing', 'shipped', 'delivered'] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
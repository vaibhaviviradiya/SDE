const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  diamondId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diamond', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  offeredPrice: { type: Number, required: true }, // The buyer's starting bid
  currentStatus: { 
    type: String, 
    enum: ['pending', 'countered', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  
  message: { type: String }, // Optional note from buyer
  isClosed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
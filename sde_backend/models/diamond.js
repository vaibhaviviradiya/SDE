const mongoose = require('mongoose');

const diamondSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shape: { type: String, required: true }, // Round, Princess, etc.[cite: 3]
  carat: { type: Number, required: true }, // e.g., 1.05[cite: 3]
  color: { type: String, required: true }, // D to Z[cite: 3]
  clarity: { type: String, required: true }, // FL, IF, VVS1, etc.[cite: 3]
  cut: { type: String, required: true },
  polish: { type: String, required: true },
  price: { type: Number, required: true },
  
  // Technical Proof: Lab Certificate[cite: 3]
  labCertificate: {
    lab: { type: String, enum: ['GIA', 'IGI', 'HRD'] },
    certificateNumber: { type: String, required: true },
    certificateFile: { type: String } // URL to PDF/Scan[cite: 3]
  },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'sold'], 
    default: 'available' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diamond', diamondSchema);
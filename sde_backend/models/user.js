const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true, 
    enum: ['manufacturer', 'trader', 'buyer', 'broker', 'admin'] // Access Control
  },
  companyName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  
  // Business Verification Data Block
  kyc: {
    gstNumber: { type: String },
    panNumber: { type: String },
    businessLicense: { type: String } // URL to uploaded file
  },
  
  // Location Information Block
  address: {
    city: { type: String, default: 'Surat' },
    state: { type: String },
    country: { type: String }
  },
  
  trustScore: { type: Number, default: 0 }, // Dynamic rating 0-5[cite: 3]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  raisedAgainst: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  details: { type: String },
  attachments: [{ type: String }],
  status: { 
    type: String, 
    enum: ['open','under_review','resolved','rejected','closed'],
    default: 'open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolution: { type: String },
  financeNotified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  donationDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);

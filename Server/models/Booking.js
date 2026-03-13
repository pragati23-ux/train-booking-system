const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'DarshanSlot', required: true },
  ticketCount: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
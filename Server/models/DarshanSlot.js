const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema({
  temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);
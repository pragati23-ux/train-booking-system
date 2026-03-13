const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { temple, slot, ticketCount } = req.body;

    // Check slot exists
    const darshanSlot = await DarshanSlot.findById(slot);
    if (!darshanSlot) return res.status(404).json({ message: 'Slot not found' });

    // Check availability
    if (!darshanSlot.isAvailable) 
      return res.status(400).json({ message: 'Slot is not available' });

    // Check capacity
    const remainingCapacity = darshanSlot.capacity - darshanSlot.bookedCount;
    if (ticketCount > remainingCapacity) 
      return res.status(400).json({ message: `Only ${remainingCapacity} tickets left` });

    // Calculate total
    const totalAmount = darshanSlot.price * ticketCount;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      temple,
      slot,
      ticketCount,
      totalAmount
    });

    // Update slot booked count
    darshanSlot.bookedCount += ticketCount;
    if (darshanSlot.bookedCount >= darshanSlot.capacity) {
      darshanSlot.isAvailable = false;
    }
    await darshanSlot.save();

    // Populate and return
    const populated = await Booking.findById(booking._id)
      .populate('temple', 'name location')
      .populate('slot', 'date time price')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('temple', 'name location')
      .populate('slot', 'date time price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (ADMIN only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('temple', 'name location')
      .populate('slot', 'date time price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') 
      return res.status(400).json({ message: 'Booking already cancelled' });

    // Free up slot capacity
    const slot = await DarshanSlot.findById(booking.slot);
    if (slot) {
      slot.bookedCount -= booking.ticketCount;
      slot.isAvailable = true;
      await slot.save();
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking };
const DarshanSlot = require('../models/DarshanSlot');

// Get all slots for a temple
const getSlotsByTemple = async (req, res) => {
  try {
    const slots = await DarshanSlot.find({ 
      temple: req.params.templeId,
      isAvailable: true 
    }).populate('temple', 'name location');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create slot (ADMIN/ORGANIZER only)
const createSlot = async (req, res) => {
  try {
    const { temple, date, time, capacity, price } = req.body;
    const slot = await DarshanSlot.create({ temple, date, time, capacity, price });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update slot (ADMIN/ORGANIZER only)
const updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const updated = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete slot (ADMIN only)
const deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    await DarshanSlot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSlotsByTemple, createSlot, updateSlot, deleteSlot };
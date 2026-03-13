const Temple = require('../models/Temple');
const { cloudinary } = require('../config/cloudinary');

// Get all temples
const getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find().populate('createdBy', 'name email');
    res.json(temples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single temple
const getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('createdBy', 'name email');
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create temple (ADMIN/ORGANIZER only)
const createTemple = async (req, res) => {
  try {
    const { name, location, description, timings } = req.body;

    // If image was uploaded, req.file will have cloudinary URL
    const imageUrl = req.file ? req.file.path : '';

    const temple = await Temple.create({
      name,
      location,
      description,
      timings,
      images: imageUrl ? [imageUrl] : [],
      createdBy: req.user._id
    });

    res.status(201).json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update temple (ADMIN/ORGANIZER only)
const updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });

    const updated = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete temple (ADMIN only)
const deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });

    await Temple.findByIdAndDelete(req.params.id);
    res.json({ message: 'Temple deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTemples, getTempleById, createTemple, updateTemple, deleteTemple };    
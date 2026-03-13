const Donation = require('../models/Donation');

// Make donation
const createDonation = async (req, res) => {
  try {
    const { temple, amount, message } = req.body;

    if (amount <= 0) 
      return res.status(400).json({ message: 'Amount must be greater than 0' });

    const donation = await Donation.create({
      user: req.user._id,
      temple,
      amount,
      message
    });

    const populated = await Donation.findById(donation._id)
      .populate('temple', 'name location')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my donations
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('temple', 'name location')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donations (ADMIN only)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('temple', 'name location')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDonation, getMyDonations, getAllDonations };
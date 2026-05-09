const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { calculateSpamScore } = require('../../spamFilter');

// Get all bookings (optionally filtered by patientPhone)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.phone) {
      filter.patientPhone = req.query.phone;
    }
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking (with Spam Filter)
router.post('/', async (req, res) => {
  try {
    const { patientName, patientPhone, patientDept, hospitalName } = req.body;
    
    // AI Spam Filter Check
    const filterResult = await calculateSpamScore({ 
      patientName, 
      patientPhone, 
      patientDept, 
      isEmergency: false,
      behaviorData: req.body.behaviorData 
    });
    if (filterResult.isSpam) {
      return res.status(403).json({ 
        error: 'Spam Detected', 
        message: 'Your request has been flagged by our AI security layer. Please try again later or call emergency services if this is an actual crisis.',
        score: filterResult.score 
      });
    }

    const tokenNum = 'TKN-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const reportTime = new Date(now.getTime() + 60 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const booking = new Booking({
      patientName,
      patientPhone,
      patientDept,
      hospitalName,
      tokenNum,
      reportTime,
      spamScore: filterResult.score
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update booking details (any field)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body; // allow any fields
    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete all bookings
router.delete('/', async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ message: 'All bookings deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

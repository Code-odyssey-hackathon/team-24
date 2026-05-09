const express = require('express');
const router = express.Router();
const SpamReputation = require('../models/SpamReputation');

// Get all reputation data
router.get('/', async (req, res) => {
  try {
    const data = await SpamReputation.find().sort({ lastRequestDate: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update ban status
router.patch('/:id', async (req, res) => {
  try {
    const { isBanned } = req.body;
    const reputation = await SpamReputation.findByIdAndUpdate(req.params.id, { isBanned }, { new: true });
    if (!reputation) return res.status(404).json({ error: 'Reputation record not found' });
    res.json(reputation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

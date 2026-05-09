const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single hospital
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create hospital
router.post('/', async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    await newHospital.save();
    res.status(201).json(newHospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update hospital
router.put('/:id', async (req, res) => {
  try {
    const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(updatedHospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete hospital
router.delete('/:id', async (req, res) => {
  try {
    const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!deletedHospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

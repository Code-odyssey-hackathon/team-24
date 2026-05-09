const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Booking = require('../models/Booking');
const { calculateSpamScore } = require('../../spamFilter');

router.post('/', async (req, res) => {
  try {
    const { patientLat, patientLng, patientPhone } = req.body;
    
    // AI Spam Filter Check (Emergency Override)
    const filterResult = await calculateSpamScore({ 
      patientPhone, 
      patientDept: 'EMERGENCY', 
      isEmergency: true,
      behaviorData: req.body.behaviorData
    });
    if (filterResult.isSpam && filterResult.score < 10) {
       return res.status(403).json({ error: 'Security Block', message: 'Potential DDoS or Malicious pattern detected.' });
    }

    const hospitals = await Hospital.find();
    if (hospitals.length === 0) {
      return res.status(404).json({ error: 'No hospitals found' });
    }

    // Create emergency bookings for ALL hospitals
    const emergencyRequests = hospitals.map(h => ({
      patientName: 'EMERGENCY PATIENT',
      patientPhone: req.body.patientPhone || '911',
      patientDept: 'EMERGENCY',
      hospitalName: h.name,
      tokenNum: 'EMRG-' + Math.floor(1000 + Math.random() * 9000),
      reportTime: 'IMMEDIATE',
      status: 'confirmed'
    }));

    await Booking.insertMany(emergencyRequests);

    // Find the nearest hospital
    let nearest = hospitals[0];
    let minDistance = Infinity;

    if (patientLat && patientLng) {
      hospitals.forEach(h => {
        const dist = Math.sqrt(Math.pow(h.lat - patientLat, 2) + Math.pow(h.lng - patientLng, 2));
        if (dist < minDistance) {
          minDistance = dist;
          nearest = h;
        }
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Emergency broadcast sent to all hospitals',
      assignedHospital: nearest.name,
      allHospitals: hospitals.map(h => h.name),
      eta: Math.floor(Math.random() * 10) + 5
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

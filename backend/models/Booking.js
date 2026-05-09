const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientDept: { type: String },
  hospitalName: { type: String },
  tokenNum: { type: String },
  reportTime: { type: String },
  spamScore: { type: Number, default: 100 },
  date: { type: String, default: () => new Date().toLocaleDateString() },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  deviceFingerprint: { type: String },
  userAgent: { type: String },
  isFlagged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Booking', bookingSchema);

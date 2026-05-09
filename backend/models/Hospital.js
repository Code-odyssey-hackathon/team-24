const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['government', 'private'], default: 'government' },
  distance: { type: Number, default: 0 },
  lat: { type: Number },
  lng: { type: Number },
  beds: { type: Number, default: 0 },
  bedsAvail: { type: Number, default: 0 },
  emergency: { type: Boolean, default: false },
  phone: { type: String },
  specialty: { type: String },
  doctors: [{ name: String, spec: String }]
});

module.exports = mongoose.model('Hospital', hospitalSchema);

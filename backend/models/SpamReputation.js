const mongoose = require('mongoose');

const spamReputationSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  trustScore: { type: Number, default: 70 }, // 0-100
  totalRequests: { type: Number, default: 0 },
  spamCount: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  lastRequestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpamReputation', spamReputationSchema);

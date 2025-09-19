const mongoose = require('mongoose');

const PrintSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: '5m' }, // OTP and session expire in 5 mins
});

module.exports = mongoose.model('PrintSession', PrintSessionSchema);
const mongoose = require('mongoose');

const PrintSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  // UPDATED: Changed expiration from 5m to 3m
  createdAt: { type: Date, default: Date.now, expires: '3m' }, 
});

module.exports = mongoose.model('PrintSession', PrintSessionSchema);
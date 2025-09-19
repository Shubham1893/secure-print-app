const mongoose = require('mongoose');

const ShortLinkSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  // This will automatically delete the link document after 15 minutes for security
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '15m' 
  },
});

module.exports = mongoose.model('ShortLink', ShortLinkSchema);
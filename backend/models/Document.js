const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true }, // The stored file name
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
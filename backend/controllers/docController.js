const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

exports.uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  try {
    const newDoc = new Document({
      user: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
    });
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete file from server
    fs.unlink(path.join(__dirname, '..', doc.filePath), (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
        // Still proceed to delete DB record
      }
    });

    await doc.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
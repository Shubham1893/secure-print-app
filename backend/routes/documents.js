const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { uploadDocument, getUserDocuments, deleteDocument } = require('../controllers/docController');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

router.route('/')
  .post(protect, upload.single('document'), uploadDocument)
  .get(protect, getUserDocuments);

router.route('/:id').delete(protect, deleteDocument);

module.exports = router;
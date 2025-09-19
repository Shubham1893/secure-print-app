const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    generatePrintLink, 
    verifyOtp, 
    getPrintDocuments,
    streamDocument,
    protectPrintSession
} = require('../controllers/printController');

// User generates the link and gets OTP
router.post('/generate-link', protect, generatePrintLink);

// Print shop verifies OTP
router.post('/verify-otp', verifyOtp);

// Print shop gets list of documents after OTP verification
router.get('/documents', protectPrintSession, getPrintDocuments);

// Print shop streams a specific document for printing
router.get('/stream/:docId', protectPrintSession, streamDocument);

module.exports = router;
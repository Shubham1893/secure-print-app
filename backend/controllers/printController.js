
const jwt = require('jsonwebtoken');
const PrintSession = require('../models/PrintSession');
const Document = require('../models/Document');
const ShortLink = require('../models/ShortLink');
const User = require('../models/User'); // <-- ADDED: Need this to find user's email
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateShortCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

// 1. Generate Print Link (No changes here)
exports.generatePrintLink = async (req, res) => {
  try {
    const user = req.user;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const longToken = crypto.randomBytes(20).toString('hex');

    await PrintSession.create({ user: user._id, otp, token: longToken });

    const shortCode = generateShortCode();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const longUrl = `${frontendUrl}/print/${longToken}`;

    await ShortLink.create({ shortCode, longUrl });
    
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const shareableLink = `${serverUrl}/s/${shortCode}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your SecurePrint One-Time Password (OTP)',
      text: `Your OTP is: ${otp}. It is valid for 3 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
        message: 'OTP sent to your email. Share the OTP and the link with the print shop.',
        shareableLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating print link' });
  }
};

// 2. Verify OTP - UPDATED SESSION TIME
exports.verifyOtp = async (req, res) => {
  const { token, otp } = req.body;
  try {
    const session = await PrintSession.findOne({ token, otp });

    if (!session) {
      return res.status(400).json({ message: 'Invalid OTP or session expired.' });
    }
    
    session.isVerified = true;
    await session.save();

    // UPDATED: Changed expiration from 4m to 2m
    const sessionToken = jwt.sign({ sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: '2m' });

    res.json({ message: 'OTP verified successfully.', sessionToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. NEW FUNCTION: Resend OTP
exports.resendOtp = async (req, res) => {
  const { token } = req.body;
  try {
    const session = await PrintSession.findOne({ token });

    if (!session) {
      return res.status(404).json({ message: 'This print session is invalid or has expired.' });
    }

    // Find the user to get their email
    const user = await User.findById(session.user);
    if (!user) {
      return res.status(404).json({ message: 'Could not find the associated user account.' });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update the session with the new OTP and reset the timer
    session.otp = newOtp;
    session.createdAt = Date.now();
    await session.save();

    // Send the new OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New SecurePrint OTP',
      text: `Your new OTP is: ${newOtp}. It is valid for 3 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'A new OTP has been sent to the document owner.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (The rest of the file remains the same) ...

// 3. Get Documents for a Verified Print Session
exports.getPrintDocuments = async (req, res) => {
  try {
    const session = await PrintSession.findById(req.session.sessionId);
    if (!session || !session.isVerified) {
        return res.status(401).json({ message: 'Not authorized for this print session.' });
    }
    const documents = await Document.find({ user: session.user }).select('originalName');
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 4. Stream a document for printing
exports.streamDocument = async (req, res) => {
    try {
        const session = await PrintSession.findById(req.session.sessionId);
        if (!session || !session.isVerified) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const doc = await Document.findById(req.params.docId);
        if (!doc || doc.user.toString() !== session.user.toString()) {
            return res.status(404).json({ message: 'Document not found.' });
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${doc.originalName}"`);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        
        res.sendFile(doc.filePath, { root: '.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Middleware to verify the short-lived session token
exports.protectPrintSession = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.session = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Session expired or invalid.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No session token.' });
  }
};







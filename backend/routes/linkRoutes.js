const express = require('express');
const router = express.Router();
const { redirectToLongUrl } = require('../controllers/linkController');

// This route handles URLs like /s/aB7xK2
router.get('/:shortCode', redirectToLongUrl);

module.exports = router;
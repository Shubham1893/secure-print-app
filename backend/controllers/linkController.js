const ShortLink = require('../models/ShortLink');

exports.redirectToLongUrl = async (req, res) => {
  try {
    const link = await ShortLink.findOne({ shortCode: req.params.shortCode });
    if (link) {
      return res.redirect(link.longUrl);
    } else {
      return res.status(404).send('Link not found or has expired.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
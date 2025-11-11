const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const uploadDir = process.env.FILE_UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });

// upload KYC documents
router.post('/upload/:userId', upload.array('documents', 5), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'user_not_found' });
    const hostPrefix = req.protocol + '://' + req.get('host');
    const docs = (req.files || []).map(f => hostPrefix + '/uploads/' + path.basename(f.path));
    user.kyc.documents = (user.kyc.documents || []).concat(docs);
    user.kyc.status = 'pending';
    await user.save();
    res.json({ ok: true, documents: user.kyc.documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

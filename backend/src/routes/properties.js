const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const multer = require('multer');
const path = require('path');

const uploadDir = process.env.FILE_UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });

// create property (host) - if authenticated, attach owner
const auth = require('../middleware/auth');
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    const body = req.body || {};
    // parse JSON fields that may be sent as strings when using form-data
    function tryParse(field) {
      if (!body[field]) return undefined;
      if (typeof body[field] === 'string') {
        try { return JSON.parse(body[field]); } catch(e) { return body[field]; }
      }
      return body[field];
    }
    const parsedPrice = tryParse('price');
    const parsedPriceByDuration = tryParse('priceByDuration');
    const parsedAmenities = tryParse('amenities');

    // build absolute URLs for uploaded files so frontend doesn't need to rewrite paths
    const hostPrefix = req.protocol + '://' + req.get('host');
    const media = (req.files || []).map(f => hostPrefix + '/uploads/' + path.basename(f.path));
    const doc = Object.assign({}, body, {
      media,
      price: parsedPrice || body.price,
      priceByDuration: parsedPriceByDuration || body.priceByDuration,
      amenities: parsedAmenities || body.amenities
    });
    if (req.user && req.user._id) doc.owner = req.user._id;
    const property = await Property.create(doc);
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// list properties (simple)
router.get('/', async (req, res) => {
  try {
    const q = {};
    if (req.query.owner) q.owner = req.query.owner;
    const props = await Property.find(q).limit(100).lean();
    res.json(props);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// get by id
router.get('/:id', async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).populate('owner').lean();
    if (!p) return res.status(404).json({ error: 'not_found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// update property (owner only) - allow toggling availability and updating simple fields
router.patch('/:id', auth, async (req, res) => {
  try {
    const p = await Property.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not_found' });
    if (!p.owner || String(p.owner) !== String(req.user._id)) return res.status(403).json({ error: 'forbidden' });
    const body = req.body || {};
    function tryParseBody(field) {
      if (body[field] === undefined) return undefined;
      if (typeof body[field] === 'string') {
        try { return JSON.parse(body[field]); } catch(e) { return body[field]; }
      }
      return body[field];
    }
    const allowed = ['title', 'description', 'price', 'available', 'amenities', 'rooms', 'priceByDuration'];
    allowed.forEach(k => {
      const val = tryParseBody(k);
      if (val !== undefined) p[k] = val;
    });
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

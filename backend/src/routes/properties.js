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
  const parsedAvailability = tryParse('availability');
  const parsedBillingModel = tryParse('billingModel');
  const parsedMinNights = tryParse('minNights');
  const parsedMaxNights = tryParse('maxNights');
  const parsedCapacity = tryParse('capacity');
  const parsedWeekdayPricing = tryParse('weekdayPricing');

    // build absolute URLs for uploaded files so frontend doesn't need to rewrite paths
    const hostPrefix = req.protocol + '://' + req.get('host');
    const media = (req.files || []).map(f => hostPrefix + '/uploads/' + path.basename(f.path));
    const doc = Object.assign({}, body, {
      media,
      price: parsedPrice || body.price,
      priceByDuration: parsedPriceByDuration || body.priceByDuration,
      amenities: parsedAmenities || body.amenities,
      availability: (parsedAvailability || body.availability) || undefined,
      billingModel: parsedBillingModel || body.billingModel,
      minNights: parsedMinNights || body.minNights,
      maxNights: parsedMaxNights || body.maxNights,
      capacity: parsedCapacity || body.capacity,
      weekdayPricing: parsedWeekdayPricing || body.weekdayPricing
    });
    if (req.user && req.user._id) doc.owner = req.user._id;
    // normalize types
    if (doc.availability && Array.isArray(doc.availability)) {
      doc.availability = doc.availability.map(a => ({
        startDate: a.startDate,
        endDate: a.endDate,
        startTime: a.startTime || undefined,
        endTime: a.endTime || undefined,
        priceOverride: a.priceOverride !== undefined && a.priceOverride !== '' ? Number(a.priceOverride) : undefined
      }));
    }
    if (doc.minNights !== undefined) doc.minNights = Number(doc.minNights);
    if (doc.maxNights !== undefined) doc.maxNights = Number(doc.maxNights);
    if (doc.capacity !== undefined) doc.capacity = Number(doc.capacity);
    if (doc.weekdayPricing && typeof doc.weekdayPricing === 'object') {
      // ensure numeric values
      Object.keys(doc.weekdayPricing).forEach(k => { doc.weekdayPricing[k] = Number(doc.weekdayPricing[k]); });
    }
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
  const allowed = ['title', 'description', 'price', 'available', 'amenities', 'rooms', 'priceByDuration', 'availability', 'billingModel', 'minNights', 'maxNights', 'capacity', 'weekdayPricing'];
    allowed.forEach(k => {
      const val = tryParseBody(k);
      if (val !== undefined) {
        // normalize
        if (k === 'availability' && Array.isArray(val)) {
          p.availability = val.map(a => ({
            startDate: a.startDate,
            endDate: a.endDate,
            startTime: a.startTime || undefined,
            endTime: a.endTime || undefined,
            priceOverride: a.priceOverride !== undefined && a.priceOverride !== '' ? Number(a.priceOverride) : undefined
          }));
        } else if ((k === 'minNights' || k === 'maxNights' || k === 'capacity') && val !== '') {
          p[k] = Number(val);
        } else if (k === 'weekdayPricing' && typeof val === 'object') {
          Object.keys(val).forEach(day => { val[day] = Number(val[day]); });
          p.weekdayPricing = val;
        } else {
          p[k] = val;
        }
      }
    });
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

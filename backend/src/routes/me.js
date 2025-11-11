const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  res.json(req.user);
});

module.exports = router;

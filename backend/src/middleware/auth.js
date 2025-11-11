const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return res.status(401).json({ error: 'missing_authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'bad_authorization' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'invalid_token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token', details: err.message });
  }
}

module.exports = authMiddleware;

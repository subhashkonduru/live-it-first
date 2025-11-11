const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');

// require admin role
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  next();
}

router.use(auth, requireAdmin);

// list users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
});

// list properties
router.get('/properties', async (req, res) => {
  try {
    const props = await Property.find();
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
});

// delete a property
router.delete('/properties/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const prop = await Property.findById(id);
    if (!prop) return res.status(404).json({ error: 'not_found' });
    await Property.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('admin delete property error', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// change user role (promote/demote)
router.post('/users/:id/role', async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body || {};
    if (!role) return res.status(400).json({ error: 'role_required' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'not_found' });
    user.role = role;
    await user.save();
    res.json({ ok: true, user });
  } catch (err) {
    console.error('admin change role error', err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

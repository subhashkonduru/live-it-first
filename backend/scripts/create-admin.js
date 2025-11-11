require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/live-it-first';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const User = require('../src/models/User');

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password';

  let user = await User.findOne({ email });
  if (!user) {
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name: 'Admin', email, passwordHash: hash, role: 'admin' });
    console.log('Created admin', email);
  } else {
    user.role = 'admin';
    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();
    console.log('Promoted existing user to admin', email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

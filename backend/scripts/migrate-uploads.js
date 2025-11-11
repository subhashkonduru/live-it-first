require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/live-it-first';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for migration');

  const Property = require('../src/models/Property');
  const User = require('../src/models/User');
  const Booking = require('../src/models/Booking');
  const Invoice = require('../src/models/Invoice');
  const fs = require('fs');

  const hostPrefix = process.env.PUBLIC_API_HOST || process.env.API_HOST || 'http://localhost:4000';
  console.log('Using host prefix:', hostPrefix);

  // helper: recursively rewrite any string that starts with /uploads or uploads/
  function rewriteValue(val) {
    if (val === null || val === undefined) return val;
    if (val instanceof Date) return val;
    // if it's not a plain object (Object), return as-is (ObjectId, Buffer, etc.)
    if (typeof val === 'object' && val.constructor && val.constructor.name !== 'Object' && !Array.isArray(val)) return val;
    if (typeof val === 'string') {
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      if (val.startsWith('/uploads') || val.startsWith('uploads/')) {
        return hostPrefix + (val.startsWith('/') ? val : '/' + val);
      }
      return val;
    }
    if (Array.isArray(val)) return val.map(v => rewriteValue(v));
    if (typeof val === 'object') {
      const out = {};
      for (const k of Object.keys(val)) out[k] = rewriteValue(val[k]);
      return out;
    }
    return val;
  }

  // backup helper
  function backupCollection(name, docs) {
    try {
      const dir = path.join(__dirname, 'backups');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${name}-backup-${Date.now()}.json`);
      fs.writeFileSync(file, JSON.stringify(docs, null, 2), 'utf8');
      console.log('Wrote backup', file);
    } catch (e) {
      console.warn('Backup failed for', name, e);
    }
  }

  // generic migration for a model
  async function migrateModel(Model, name) {
    const docs = await Model.find({}).lean();
    if (!docs || docs.length === 0) return 0;
    backupCollection(name, docs);
    let updated = 0;
    for (const d of docs) {
      const newDoc = rewriteValue(d);
      // exclude _id from $set
      const {_id, __v, ...rest} = newDoc;
      // determine if changed by shallow comparison of JSON
      if (JSON.stringify(d) !== JSON.stringify(newDoc)) {
        await Model.updateOne({ _id: d._id }, { $set: rest });
        updated++;
        console.log(`Updated ${name} ${d._id}`);
      }
    }
    return updated;
  }

  const propUpdated = await migrateModel(Property, 'properties');
  const usersUpdated = await migrateModel(User, 'users');
  const bookingsUpdated = await migrateModel(Booking, 'bookings');
  const invoicesUpdated = await migrateModel(Invoice, 'invoices');

  console.log(`Migration complete. Properties updated: ${propUpdated}, Users updated: ${usersUpdated}, Bookings updated: ${bookingsUpdated}, Invoices updated: ${invoicesUpdated}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

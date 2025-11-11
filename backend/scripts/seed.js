require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/live-it-first';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding');

  const User = require('../src/models/User');
  const Property = require('../src/models/Property');
  const Booking = require('../src/models/Booking');
  const Invoice = require('../src/models/Invoice');

  // create host
  const hostEmail = process.env.SEED_HOST_EMAIL || 'host@example.com';
  let host = await User.findOne({ email: hostEmail });
  if (!host) {
    const hPass = await bcrypt.hash('password', 10);
    host = await User.create({ name: 'Demo Host', email: hostEmail, passwordHash: hPass, role: 'host' });
    console.log('Created host', hostEmail);
  } else console.log('Host already exists');

  // create guest
  const guestEmail = process.env.SEED_GUEST_EMAIL || 'guest@example.com';
  let guest = await User.findOne({ email: guestEmail });
  if (!guest) {
    const gPass = await bcrypt.hash('password', 10);
    guest = await User.create({ name: 'Demo Guest', email: guestEmail, passwordHash: gPass, role: 'guest' });
    console.log('Created guest', guestEmail);
  } else console.log('Guest already exists');

  // create property
  // create several demo properties with external images (no local uploads required)
  const demoProps = [
    {
      title: 'Demo Property — Lakeside Retreat',
      description: 'A short demo property used for local testing. Calm lake views and wood-fired BBQ.',
      media: [
        'https://images.unsplash.com/photo-1501117716987-c8e5a0f8d3c6?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1505691723518-36a1a86a1e6f?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?q=80&w=1600&auto=format&fit=crop&crop=entropy'
      ],
      price: { baseRate: 120, cleaning: 20, refundableDeposit: 50, platformFeePct: 0.12 },
      available: true
    },
    {
      title: 'Test Villa',
      description: 'A cosy villa for weekend getaways. Close to hiking trails and wine country.',
      media: [
        'https://images.unsplash.com/photo-1505691723518-36a1a86a1e6f?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop&crop=entropy'
      ],
      price: { baseRate: 200, cleaning: 30, refundableDeposit: 100, platformFeePct: 0.1 },
      available: true
    },
    {
      title: 'Urban Loft — City Centre',
      description: 'Modern loft in the heart of the city, perfect for business travellers.',
      media: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1473447195725-5c0b2f0e3b2b?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop&crop=entropy'
      ],
      price: { baseRate: 150, cleaning: 25, refundableDeposit: 75, platformFeePct: 0.11 },
      available: true
    }
  ];

  for (const dp of demoProps) {
    let exists = await Property.findOne({ title: dp.title });
    if (!exists) {
      const created = await Property.create(Object.assign({}, dp, { owner: host._id }));
      console.log('Created demo property', created.title, created._id);
    } else {
      console.log('Demo property exists:', exists.title);
    }
  }
  // pick one property for booking reference
  let prop = await Property.findOne({ owner: host._id }).lean();

  // create booking + invoice
  let booking = await Booking.findOne({ property: prop._id, guest: guest._id });
  if (!booking) {
    booking = await Booking.create({ property: prop._id, guest: guest._id, checkIn: new Date(), checkOut: new Date(Date.now()+3*24*3600*1000), durationDays: 3, status: 'pending' });
    const base = Number(prop.price.baseRate || 0);
    const cleaning = Number(prop.price.cleaning || 0);
    const deposit = Number(prop.price.refundableDeposit || 0);
    const subtotal = base * 3 + cleaning + deposit;
    const platformFee = Math.round(subtotal * (prop.price.platformFeePct || 0.1));
    const taxAmount = Math.round(subtotal * 0.1);
    const total = subtotal + taxAmount + platformFee;
    const invoice = await Invoice.create({ booking: booking._id, guest: guest._id, lineItems: [ { label: 'Rate', amount: base*3 }, { label: 'Cleaning', amount: cleaning }, { label: 'Deposit', amount: deposit } ], taxes: [ { label: 'VAT', amount: taxAmount } ], platformFee, total, currency: 'USD' });
    console.log('Created booking and invoice', booking._id, invoice._id);
  } else console.log('Booking already exists for demo guest/property');

  console.log('Seeding complete. Emails/passwords: host:', hostEmail, '/password and guest:', guestEmail, '/password');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

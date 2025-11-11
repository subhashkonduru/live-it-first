const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Property = require('../models/Property');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

// create booking (improved): builds invoice, optionally returns Stripe clientSecret
router.post('/', async (req, res) => {
  try {
    const { property: propertyId, guest, checkIn, checkOut, durationDays } = req.body;
    const property = await Property.findById(propertyId).lean();
    if (!property) return res.status(404).json({ error: 'property_not_found' });

    // compute pricing
    const base = Number(property.price?.baseRate || 0);
    const cleaning = Number(property.price?.cleaning || 0);
    const deposit = Number(property.price?.refundableDeposit || 0);
    const platformPct = Number(property.price?.platformFeePct || 0.1);
    const nights = Number(durationDays) || 3;
    const subtotal = base * nights + cleaning + deposit;
    const platformFee = Math.round(subtotal * platformPct);
    // taxes: placeholder 10% VAT on subtotal
    const taxAmount = Math.round(subtotal * 0.1);
    const total = subtotal + taxAmount + platformFee;

    const b = await Booking.create({ property: propertyId, guest, checkIn, checkOut, durationDays, status: 'pending' });

    const invoice = await Invoice.create({
      booking: b._id,
      guest,
      lineItems: [
        { label: 'Trial rate', amount: base * nights },
        { label: 'Cleaning', amount: cleaning },
        { label: 'Refundable deposit', amount: deposit }
      ],
      taxes: [{ label: 'VAT', amount: taxAmount }],
      platformFee: platformFee,
      total: total,
      currency: 'USD'
    });

    // If Stripe configured, create payment intent and return clientSecret
    if (process.env.STRIPE_SECRET) {
      try {
        const pi = await stripe.paymentIntents.create({
          amount: Math.round(total * 100),
          currency: invoice.currency || 'usd',
          metadata: { bookingId: String(b._id), invoiceId: String(invoice._id) }
        });
        return res.json({ booking: b, invoice, clientSecret: pi.client_secret, paymentIntentId: pi.id });
      } catch (stripeErr) {
        console.error('stripe create error', stripeErr);
        // fallback to returning invoice without clientSecret
        return res.json({ booking: b, invoice });
      }
    }

    // no stripe configured — return objects and allow simulated payment
    res.json({ booking: b, invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// simulate/complete payment for a booking (or accept payment intent confirmation)
router.post('/:id/pay', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { simulate, paymentIntentId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'booking_not_found' });

    const invoice = await Invoice.findOne({ booking: booking._id });
    if (!invoice) return res.status(404).json({ error: 'invoice_not_found' });

    // If Stripe and paymentIntentId provided, you might verify intent status here (omitted for brevity)
    if (process.env.STRIPE_SECRET && paymentIntentId) {
      try {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (pi.status === 'succeeded' || pi.status === 'requires_capture') {
          invoice.paid = true;
          invoice.paidAt = new Date();
          await invoice.save();
          booking.status = 'confirmed';
          await booking.save();
          return res.json({ ok: true, booking, invoice, paymentIntent: pi });
        }
        return res.status(400).json({ error: 'payment_not_completed', status: pi.status });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'stripe_error' });
      }
    }

    if (simulate) {
      invoice.paid = true;
      invoice.paidAt = new Date();
      await invoice.save();
      booking.status = 'confirmed';
      await booking.save();
      return res.json({ ok: true, booking, invoice });
    }

    return res.status(400).json({ error: 'no_action' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// get bookings by guest
router.get('/guest/:id', async (req, res) => {
  try {
    const list = await Booking.find({ guest: req.params.id }).populate('property').lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// get booking by id (with invoice)
router.get('/:id', async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id).populate('property').lean();
    if (!b) return res.status(404).json({ error: 'not_found' });
    const invoice = await Invoice.findOne({ booking: b._id }).lean();
    res.json({ booking: b, invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

// Placeholder create payment intent (guest pays)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    // In production use Stripe SDK; here we return a fake client_secret for frontend dev
    if (!process.env.STRIPE_SECRET) {
      return res.json({ clientSecret: 'test_client_secret', amount });
    }
    const pi = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: pi.client_secret, id: pi.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Stripe webhook stub
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // For local development with no stripe secret we'll just acknowledge
  console.log('Webhook received');
  res.json({ received: true });
});

module.exports = router;

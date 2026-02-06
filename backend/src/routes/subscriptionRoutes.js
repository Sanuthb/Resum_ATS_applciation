const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const stripe = require('../config/stripe');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

// Create Stripe Checkout session (no webhook - verify on success redirect)
router.post('/create-checkout-session', async (req, res) => {
  const user_id = req.user.id;
  const user_email = req.user.email;

  // STRIPE_PRICE_ID must be a Price ID (price_xxx), not a Product ID (prod_xxx)
  const priceId = STRIPE_PRICE_ID && STRIPE_PRICE_ID.startsWith('price_') ? STRIPE_PRICE_ID : null;

  if (!stripe || !priceId) {
    // Fallback: demo upgrade when Stripe not configured
    try {
      const { error } = await supabase.from('profiles').update({ tier: 'pro' }).eq('id', user_id);
      if (error) throw error;
      return res.json({ url: null, demo: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Use 'payment' for one-time (e.g. 129 INR), 'subscription' for recurring
  const mode = process.env.STRIPE_MODE || 'payment';

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/dashboard`,
      customer_email: user_email,
      client_reference_id: user_id,
      metadata: { user_id }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    const msg = err.type === 'StripeInvalidRequestError'
      ? 'Invalid Stripe configuration. Use a Price ID (price_xxx) in STRIPE_PRICE_ID.'
      : err.message;
    res.status(500).json({ error: msg });
  }
});

// Verify session and upgrade user (called from success page - no webhook needed)
router.get('/verify-session', async (req, res) => {
  const { session_id } = req.query;
  const user_id = req.user.id;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    if (session.client_reference_id !== user_id && session.metadata?.user_id !== user_id) {
      return res.status(403).json({ error: 'Session does not belong to this user' });
    }

    const { data, error } = await supabase.from('profiles').update({ tier: 'pro' }).eq('id', user_id).select();
    if (error) {
      console.error('Profiles update error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ status: 'success', tier: 'pro' });
  } catch (err) {
    console.error('Verify session error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Demo upgrade (when Stripe not configured)
router.post('/upgrade', async (req, res) => {
  const user_id = req.user.id;
  try {
    const { error } = await supabase.from('profiles').update({ tier: 'pro' }).eq('id', user_id);
    if (error) throw error;
    res.json({ status: 'success', tier: 'pro' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

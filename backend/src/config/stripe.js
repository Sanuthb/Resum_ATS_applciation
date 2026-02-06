let stripe = null;
try {
  const Stripe = require('stripe');
  const key = process.env.STRIPE_SECRET_KEY;
  if (key) stripe = new Stripe(key);
} catch (e) {
  console.warn('Stripe not available. Run: npm install stripe');
}
module.exports = stripe;

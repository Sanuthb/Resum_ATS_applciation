const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Upgrade to Pro (demo - in production, integrate Stripe/webhook)
router.post('/upgrade', async (req, res) => {
  const user_id = req.user.id;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ tier: 'pro' })
      .eq('id', user_id);

    if (error) throw error;
    req.user.tier = 'pro';
    res.json({ status: 'success', tier: 'pro' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

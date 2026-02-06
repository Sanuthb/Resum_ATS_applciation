const supabase = require('../config/supabase');

/**
 * Attach user tier from profiles to req.user
 * Call this after protect middleware
 */
exports.attachTier = async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', req.user.id)
      .single();
    req.user.tier = data?.tier || 'free';
    next();
  } catch (err) {
    req.user.tier = 'free';
    next();
  }
};

/**
 * Require Pro tier for route access
 */
exports.requirePro = (req, res, next) => {
  if (req.user.tier === 'pro') return next();
  res.status(403).json({
    error: 'Pro subscription required',
    message: 'Upgrade to Pro to unlock AI optimization, cover letter generation, and unlimited exports.'
  });
};

const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'You are not logged in. Please login to get access.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = decoded;

    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', decoded.id)
      .single();
    req.user.tier = profile?.tier || 'free';

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token or session expired.' });
  }
};

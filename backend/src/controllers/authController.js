const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'secret-key', {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  console.log('Register request received. Body exists:', !!req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('Registration failed: Request body is empty or undefined');
    return res.status(400).json({ 
      error: 'Request body is missing. Please ensure Content-Type is application/json' 
    });
  }
  const { email, password, fullName } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) return res.status(400).json({ error: error.message });

    const token = signToken(data.user.id, data.user.email);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(401).json({ error: error.message });

    const token = signToken(data.user.id, data.user.email);

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, tier')
      .eq('id', req.user.id)
      .single();

    res.status(200).json({
      status: 'success',
      user: {
        id: req.user.id,
        email: req.user.email,
        fullName: profile?.full_name,
        tier: profile?.tier || 'free'
      }
    });
  } catch (err) {
    res.status(200).json({
      status: 'success',
      user: { ...req.user, tier: 'free' }
    });
  }
};

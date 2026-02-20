const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key', {
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

    const token = signToken(data.user.id);

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

    const token = signToken(data.user.id);

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
  // User is already attached to req by protect middleware
  res.status(200).json({
    status: 'success',
    user: req.user
  });
};

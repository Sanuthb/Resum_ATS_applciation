const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use SERVICE_ROLE key for backend - required for updating profiles (RLS bypass)
// Anon key will block profile updates from the backend
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Some features may not work.');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Profile tier updates may fail. Get it from Supabase Dashboard → Settings → API.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

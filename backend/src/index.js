require('dotenv').config();
const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ type: '*/*' })); // Parse all bodies as JSON for debugging
app.use(cookieParser());

// Debug Middleware (Already exists, but placing for clarity)
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    console.log('Headers Content-Type:', req.headers['content-type']);
    // req.body will be defined if express.json matched the type
  }
  next();
});

const authController = require('./controllers/authController');

// Routes
console.log('Registering routes...');
app.get('/test', (req, res) => res.json({ message: 'Auth routes mounted' }));
// app.post('/api/auth/register', authController.register); // Direct exposure for debug
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', protect, require('./routes/resumeRoutes'));
app.use('/api/jobs', protect, require('./routes/jobRoutes'));
app.use('/api/ai', protect, require('./routes/aiRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Catch-all 404
app.use((req, res, next) => {
  console.log(`404 at: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Corrected from type: '*/*'
app.use(cookieParser());

// Route Mounting
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', protect, require('./routes/resumeRoutes'));
app.use('/api/jobs', protect, require('./routes/jobRoutes'));
app.use('/api/ai', protect, require('./routes/aiRoutes'));
app.use('/api/subscription', protect, require('./routes/subscriptionRoutes'));
app.use('/api/pdf', protect, require('./routes/pdfRoutes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
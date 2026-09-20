const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB } = require('./db');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root / Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: `${process.env.THEATRE_NAME || 'Mayura Grand Cinemas'} API`,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server & Initialize Database
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    const theatre = process.env.THEATRE_NAME || 'Mayura Grand Cinemas';
    console.log(`🎭 ${theatre} API Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🚀 Base URL: http://localhost:${PORT}/api`);
  });
}

startServer();

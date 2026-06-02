const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const couponRoutes = require('./routes/coupons');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const addressRoutes = require('./routes/addresses');
const reviewRoutes = require('./routes/reviews');

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Worm API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Book Worm API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      books: '/api/v1/books',
      coupons: '/api/v1/coupons',
      orders: '/api/v1/orders',
      wishlist: '/api/v1/wishlist',
      addresses: '/api/v1/addresses',
      reviews: '/api/v1/reviews'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;

// Made with Bob

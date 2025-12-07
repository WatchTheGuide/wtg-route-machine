/**
 * WTG API Server - Unified Express Application
 * Combines POI, Tours, and Admin APIs into a single server
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {
  poiRouter,
  toursRouter,
  adminAuthRouter,
  adminToursRouter,
} from './routes/index.js';
import config from './config.js';

const app = express();

// Check if running in test mode
const isTestMode = process.env.NODE_ENV === 'test';

// Rate limiters (disabled in test mode)
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestMode, // Skip rate limiting in tests
});

const authLimiter = rateLimit({
  windowMs: config.authRateLimitWindowMs,
  max: config.authRateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestMode, // Skip rate limiting in tests
});

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(generalLimiter);

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'wtg-api-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      poi: '/api/poi',
      tours: '/api/tours',
      admin: '/api/admin',
    },
  });
});

// ============================================
// PUBLIC API ROUTES
// ============================================

// POI API - /api/poi/*
app.use('/api/poi', poiRouter);

// Tours API - /api/tours/*
app.use('/api/tours', toursRouter);

// ============================================
// ADMIN API ROUTES
// ============================================

// Admin Auth API - /api/admin/auth/*
// Apply stricter rate limiting on login
app.use('/api/admin/auth/login', authLimiter);
app.use('/api/admin/auth', adminAuthRouter);

// Admin Tours API - /api/admin/tours/*
app.use('/api/admin/tours', adminToursRouter);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    availableEndpoints: {
      health: 'GET /health',
      poiCities: 'GET /api/poi/cities',
      poiCategories: 'GET /api/poi/categories',
      toursCities: 'GET /api/tours/cities',
      adminLogin: 'POST /api/admin/auth/login',
    },
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message:
        config.nodeEnv === 'production' ? 'An error occurred' : err.message,
    });
  }
);

export default app;

/**
 * WTG API Server - Unified Express Application
 * Combines POI, Tours, and Admin APIs into a single server
 */

import express from 'express';
import cors from 'cors';
import {
  poiRouter,
  toursRouter,
  adminAuthRouter,
  adminToursRouter,
} from './routes/index.js';
import { generalLimiter, authLimiter } from './middleware/index.js';
import config from './config.js';

const app = express();

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

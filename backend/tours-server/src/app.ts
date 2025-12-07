import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import toursRouter from './routes/tours.routes.js';
import adminAuthRouter from './routes/admin.auth.routes.js';
import adminToursRouter from './routes/admin.tours.routes.js';
import config from './config.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
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
    service: 'tours-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/tours', toursRouter);

// Admin API routes (with auth rate limiting on login)
app.use('/api/admin/auth/login', authLimiter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/tours', adminToursRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Error handler
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
        process.env.NODE_ENV === 'production'
          ? 'An error occurred'
          : err.message,
    });
  }
);

export default app;

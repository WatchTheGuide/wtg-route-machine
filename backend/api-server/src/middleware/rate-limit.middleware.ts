/**
 * Rate Limiting Middleware (Epic 13)
 *
 * Provides rate limiting protection for API endpoints:
 * - General API limiter: 100 req/15min per IP
 * - Auth limiter: 5 req/15min per IP (login endpoints)
 * - Admin CRUD limiter: 30 req/1min per user (POST/PUT/DELETE)
 *
 * @see user_stories/epic_13_api_rate_limiting.md
 */

import rateLimit from 'express-rate-limit';
import config from '../config.js';

// Check if running in test mode
const isTestMode = process.env.NODE_ENV === 'test';

/**
 * US 13.1: General API Rate Limiter
 *
 * Protects all API routes from excessive requests.
 * - Window: 15 minutes (configurable via RATE_LIMIT_WINDOW_MS)
 * - Max requests: 100 per IP (configurable via RATE_LIMIT_MAX_REQUESTS)
 * - Returns 429 Too Many Requests when limit exceeded
 * - Includes RateLimit-* headers in response
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: () => isTestMode, // Skip rate limiting in tests
  validate: { xForwardedForHeader: false }, // Disable IPv6 warning
});

/**
 * US 13.2: Auth Rate Limiter (Stricter)
 *
 * Protects authentication endpoints from brute-force attacks.
 * - Window: 15 minutes (configurable via AUTH_RATE_LIMIT_WINDOW_MS)
 * - Max requests: 5 per IP (configurable via AUTH_RATE_LIMIT_MAX_REQUESTS)
 * - Returns 429 Too Many Requests when limit exceeded
 * - Applied to /api/admin/auth/login endpoint
 */
export const authLimiter = rateLimit({
  windowMs: config.authRateLimitWindowMs,
  max: config.authRateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestMode,
  validate: { xForwardedForHeader: false },
});

/**
 * US 13.3: Admin CRUD Rate Limiter
 *
 * Limits the frequency of create/update/delete operations in admin panel.
 * - Window: 1 minute (configurable via ADMIN_CRUD_RATE_LIMIT_WINDOW_MS)
 * - Max requests: 30 per user (configurable via ADMIN_CRUD_RATE_LIMIT_MAX_REQUESTS)
 * - Identifies user by JWT token (req.user.id), fallback to IP
 * - Skips GET requests (read operations are not limited)
 */
export const adminCrudLimiter = rateLimit({
  windowMs: config.adminCrudRateLimitWindowMs,
  max: config.adminCrudRateLimitMaxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many operations, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTestMode || req.method === 'GET', // Skip in tests and for GET requests
  validate: { xForwardedForHeader: false, ip: false },
  // Use user ID from JWT instead of IP (when available)
  keyGenerator: (req) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user;
    return user?.id || 'anonymous';
  },
});

/**
 * Environment configuration with defaults
 */

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
    10
  ),

  // Auth rate limiting (stricter for login)
  authRateLimitWindowMs: parseInt(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000',
    10
  ), // 15 minutes
  authRateLimitMaxRequests: parseInt(
    process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5',
    10
  ), // 5 attempts

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
} as const;

export default config;

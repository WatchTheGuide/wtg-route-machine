/**
 * Rate Limiting Middleware Tests (TDD - Epic 13)
 *
 * These tests verify the rate limiting functionality for protecting
 * sensitive endpoints from abuse and brute-force attacks.
 *
 * Test Strategy:
 * 1. General API Rate Limiter - 100 req/15min per IP
 * 2. Auth Rate Limiter - 5 req/15min per IP (login endpoint)
 * 3. Admin CRUD Rate Limiter - 30 req/1min per user (POST/PUT/DELETE)
 */

import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import config from '../config.js';
import { ensureInitialized } from '../services/auth.service.js';

/**
 * Helper to create a fresh Express app with rate limiters for testing
 * This allows us to test rate limiting without the skip logic in main app
 */
function createGeneralTestApp(limit: number = 5): Express {
  const testApp = express();
  testApp.use(express.json());

  const generalLimiter = rateLimit({
    windowMs: 1000, // 1 second for faster tests
    max: limit,
    message: {
      error: 'Too Many Requests',
      message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

  testApp.use('/api', generalLimiter);

  testApp.get('/api/test', (_req, res) => {
    res.json({ message: 'ok' });
  });

  return testApp;
}

function createAuthTestApp(limit: number = 3): Express {
  const testApp = express();
  testApp.use(express.json());

  const authLimiter = rateLimit({
    windowMs: 1000,
    max: limit,
    message: {
      error: 'Too Many Requests',
      message: 'Too many login attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

  testApp.post('/api/auth/login', authLimiter, (_req, res) => {
    res.json({ message: 'login attempt' });
  });

  return testApp;
}

function createAdminCrudTestApp(limit: number = 5): Express {
  const testApp = express();
  testApp.use(express.json());

  const adminCrudLimiter = rateLimit({
    windowMs: 1000,
    max: limit,
    message: {
      error: 'Too Many Requests',
      message: 'Too many operations, please slow down',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
    skip: (req) => req.method === 'GET', // Don't rate limit GET requests
  });

  testApp.get('/api/admin/tours', adminCrudLimiter, (_req, res) => {
    res.json({ message: 'list tours' });
  });

  testApp.post('/api/admin/tours', adminCrudLimiter, (_req, res) => {
    res.json({ message: 'create tour' });
  });

  testApp.put('/api/admin/tours/:id', adminCrudLimiter, (_req, res) => {
    res.json({ message: 'update tour' });
  });

  testApp.delete('/api/admin/tours/:id', adminCrudLimiter, (_req, res) => {
    res.json({ message: 'delete tour' });
  });

  return testApp;
}

describe('Rate Limiting Middleware (Epic 13)', () => {
  describe('US 13.1: General API Rate Limiter', () => {
    it('should allow requests within the limit', async () => {
      const testApp = createGeneralTestApp(5);

      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(testApp).get('/api/test');
        expect(response.status).toBe(200);
      }
    });

    it('should block requests exceeding the limit with 429', async () => {
      const testApp = createGeneralTestApp(3);

      // Make requests within limit
      for (let i = 0; i < 3; i++) {
        await request(testApp).get('/api/test');
      }

      // Next request should be blocked
      const response = await request(testApp).get('/api/test');

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Too Many Requests');
      expect(response.body.message).toContain('Too many requests');
    });

    it('should return RateLimit-* headers', async () => {
      const testApp = createGeneralTestApp(10);

      const response = await request(testApp).get('/api/test');

      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should decrement remaining count with each request', async () => {
      const testApp = createGeneralTestApp(5);

      const response1 = await request(testApp).get('/api/test');
      const remaining1 = parseInt(response1.headers['ratelimit-remaining'], 10);

      const response2 = await request(testApp).get('/api/test');
      const remaining2 = parseInt(response2.headers['ratelimit-remaining'], 10);

      expect(remaining2).toBe(remaining1 - 1);
    });

    it('should not include legacy X-RateLimit-* headers', async () => {
      const testApp = createGeneralTestApp(5);

      const response = await request(testApp).get('/api/test');

      expect(response.headers).not.toHaveProperty('x-ratelimit-limit');
      expect(response.headers).not.toHaveProperty('x-ratelimit-remaining');
    });
  });

  describe('US 13.2: Auth Rate Limiter (Stricter)', () => {
    it('should allow login attempts within the stricter limit', async () => {
      const testApp = createAuthTestApp(5);

      // Make 5 login attempts (within limit)
      for (let i = 0; i < 5; i++) {
        const response = await request(testApp)
          .post('/api/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' });

        expect(response.status).toBe(200);
      }
    });

    it('should block login attempts after exceeding limit with 429', async () => {
      const testApp = createAuthTestApp(3);

      // Make 3 login attempts (limit)
      for (let i = 0; i < 3; i++) {
        await request(testApp)
          .post('/api/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' });
      }

      // 4th attempt should be blocked
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });

      expect(response.status).toBe(429);
      expect(response.body.message).toContain('Too many login attempts');
    });

    it('should have stricter limit than general API limiter', () => {
      // Verify configuration
      expect(config.authRateLimitMaxRequests).toBeLessThan(
        config.rateLimitMaxRequests
      );
    });

    it('should count all attempts including successful ones', async () => {
      const testApp = createAuthTestApp(2);

      // Make 2 attempts
      await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' });

      await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' });

      // 3rd attempt should be blocked
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' });

      expect(response.status).toBe(429);
    });
  });

  describe('US 13.3: Admin CRUD Rate Limiter', () => {
    it('should NOT rate limit GET requests', async () => {
      const testApp = createAdminCrudTestApp(2);

      // Make many GET requests - should all pass because GET is skipped
      for (let i = 0; i < 10; i++) {
        const response = await request(testApp).get('/api/admin/tours');
        expect(response.status).toBe(200);
      }
    });

    it('should rate limit POST requests', async () => {
      const testApp = createAdminCrudTestApp(2);

      // Make POST requests within limit
      await request(testApp).post('/api/admin/tours').send({ name: 'Tour 1' });
      await request(testApp).post('/api/admin/tours').send({ name: 'Tour 2' });

      // Next POST should be blocked
      const response = await request(testApp)
        .post('/api/admin/tours')
        .send({ name: 'Tour 3' });

      expect(response.status).toBe(429);
      expect(response.body.message).toContain('Too many operations');
    });

    it('should rate limit PUT requests', async () => {
      const testApp = createAdminCrudTestApp(2);

      // Make PUT requests within limit
      await request(testApp)
        .put('/api/admin/tours/1')
        .send({ name: 'Updated 1' });
      await request(testApp)
        .put('/api/admin/tours/2')
        .send({ name: 'Updated 2' });

      // Next PUT should be blocked
      const response = await request(testApp)
        .put('/api/admin/tours/3')
        .send({ name: 'Updated 3' });

      expect(response.status).toBe(429);
    });

    it('should rate limit DELETE requests', async () => {
      const testApp = createAdminCrudTestApp(2);

      // Make DELETE requests within limit
      await request(testApp).delete('/api/admin/tours/1');
      await request(testApp).delete('/api/admin/tours/2');

      // Next DELETE should be blocked
      const response = await request(testApp).delete('/api/admin/tours/3');

      expect(response.status).toBe(429);
    });

    it('should share limit across POST, PUT, DELETE operations', async () => {
      const testApp = createAdminCrudTestApp(3);

      // Mix of operations
      await request(testApp).post('/api/admin/tours').send({ name: 'Tour' });
      await request(testApp)
        .put('/api/admin/tours/1')
        .send({ name: 'Updated' });
      await request(testApp).delete('/api/admin/tours/2');

      // Next operation (any type) should be blocked
      const response = await request(testApp)
        .post('/api/admin/tours')
        .send({ name: 'Another' });

      expect(response.status).toBe(429);
    });
  });

  describe('US 13.4: Configurable Rate Limits', () => {
    it('should have general rate limit config available', () => {
      expect(config.rateLimitWindowMs).toBeDefined();
      expect(config.rateLimitMaxRequests).toBeDefined();
      expect(typeof config.rateLimitWindowMs).toBe('number');
      expect(typeof config.rateLimitMaxRequests).toBe('number');
    });

    it('should have auth rate limit config available', () => {
      expect(config.authRateLimitWindowMs).toBeDefined();
      expect(config.authRateLimitMaxRequests).toBeDefined();
      expect(typeof config.authRateLimitWindowMs).toBe('number');
      expect(typeof config.authRateLimitMaxRequests).toBe('number');
    });

    it('should have sensible default values', () => {
      // General: 100 requests per 15 minutes
      expect(config.rateLimitWindowMs).toBe(900000); // 15 min
      expect(config.rateLimitMaxRequests).toBe(100);

      // Auth: 5 requests per 15 minutes
      expect(config.authRateLimitWindowMs).toBe(900000); // 15 min
      expect(config.authRateLimitMaxRequests).toBe(5);
    });
  });

  describe('US 13.5: Rate Limit Response Headers', () => {
    it('should include RateLimit-Limit header with max requests', async () => {
      const testApp = createGeneralTestApp(10);

      const response = await request(testApp).get('/api/test');

      expect(response.headers['ratelimit-limit']).toBe('10');
    });

    it('should include RateLimit-Remaining header', async () => {
      const testApp = createGeneralTestApp(10);

      const response = await request(testApp).get('/api/test');

      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(parseInt(response.headers['ratelimit-remaining'], 10)).toBe(9);
    });

    it('should include RateLimit-Reset header with reset timestamp', async () => {
      const testApp = createGeneralTestApp(10);

      const response = await request(testApp).get('/api/test');

      expect(response.headers['ratelimit-reset']).toBeDefined();
      const resetTime = parseInt(response.headers['ratelimit-reset'], 10);
      expect(resetTime).toBeGreaterThan(0);
    });

    it('should show 0 remaining when limit is reached', async () => {
      const testApp = createGeneralTestApp(2);

      await request(testApp).get('/api/test');
      const response = await request(testApp).get('/api/test');

      expect(response.headers['ratelimit-remaining']).toBe('0');
    });
  });

  describe('US 13.6: Error Response Format', () => {
    it('should return JSON error response when rate limited', async () => {
      const testApp = createGeneralTestApp(1);

      await request(testApp).get('/api/test');
      const response = await request(testApp).get('/api/test');

      expect(response.status).toBe(429);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('should return appropriate error message for auth limiter', async () => {
      const testApp = createAuthTestApp(2);

      // Make requests sequentially to avoid HTTP parsing issues
      const firstResponse = await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' });
      expect(firstResponse.status).toBe(200);

      const secondResponse = await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' });
      expect(secondResponse.status).toBe(200);

      // Third request should be blocked
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' });

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Too Many Requests');
      expect(response.body.message).toContain('login attempts');
    });

    it('should return appropriate error message for admin CRUD limiter', async () => {
      const testApp = createAdminCrudTestApp(1);

      await request(testApp).post('/api/admin/tours').send({});
      const response = await request(testApp).post('/api/admin/tours').send({});

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('Too Many Requests');
      expect(response.body.message).toContain('operations');
    });
  });
});

describe('Rate Limiting in Production App', () => {
  beforeAll(async () => {
    await ensureInitialized();
  });

  describe('Configuration verification', () => {
    it('should have rate limiting configured in config.ts', () => {
      expect(config).toHaveProperty('rateLimitWindowMs');
      expect(config).toHaveProperty('rateLimitMaxRequests');
      expect(config).toHaveProperty('authRateLimitWindowMs');
      expect(config).toHaveProperty('authRateLimitMaxRequests');
    });

    it('should have auth limiter stricter than general limiter', () => {
      // Auth should have fewer allowed requests
      expect(config.authRateLimitMaxRequests).toBeLessThan(
        config.rateLimitMaxRequests
      );
    });
  });
});

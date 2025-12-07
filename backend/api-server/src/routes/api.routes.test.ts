/**
 * API Routes Integration Tests
 */
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { ensureInitialized } from '../services/auth.service.js';

describe('API Routes', () => {
  // Ensure default admin user is initialized before all tests
  beforeAll(async () => {
    await ensureInitialized();
  });
  describe('Health Check', () => {
    it('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'wtg-api-server');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('POI Routes', () => {
    it('GET /api/poi/cities should return cities list', async () => {
      const response = await request(app).get('/api/poi/cities');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cities');
      expect(Array.isArray(response.body.cities)).toBe(true);
      expect(response.body.cities.length).toBeGreaterThan(0);
    });

    it('GET /api/poi/categories should return categories list', async () => {
      const response = await request(app).get('/api/poi/categories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
    });

    it('GET /api/poi/:cityId should return POIs for city', async () => {
      const response = await request(app).get('/api/poi/krakow');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('city', 'Kraków');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('pois');
      expect(Array.isArray(response.body.pois)).toBe(true);
    });

    it('GET /api/poi/:cityId should return 404 for unknown city', async () => {
      const response = await request(app).get('/api/poi/unknown-city');

      expect(response.status).toBe(404);
    });

    it('GET /api/poi/:cityId/search should search POIs', async () => {
      const response = await request(app)
        .get('/api/poi/krakow/search')
        .query({ q: 'wawel' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('query', 'wawel');
      expect(response.body).toHaveProperty('pois');
      expect(Array.isArray(response.body.pois)).toBe(true);
    });
  });

  describe('Tours Routes', () => {
    it('GET /api/tours/cities should return cities list', async () => {
      const response = await request(app).get('/api/tours/cities');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cities');
      expect(Array.isArray(response.body.cities)).toBe(true);
      expect(response.body.cities.length).toBe(4);
    });

    it('GET /api/tours/:cityId should return tours for city', async () => {
      const response = await request(app).get('/api/tours/krakow');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tours');
      expect(Array.isArray(response.body.tours)).toBe(true);
      expect(response.body.tours.length).toBeGreaterThan(0);
    });

    it('GET /api/tours/:cityId should return 404 for invalid city', async () => {
      const response = await request(app).get('/api/tours/invalid-city');

      expect(response.status).toBe(404);
    });
  });

  describe('Admin Auth Routes', () => {
    let accessToken: string;
    let refreshToken: string;

    it('POST /api/admin/auth/login should login successfully', async () => {
      const response = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@wtg.pl',
        password: 'admin123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@wtg.pl');

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('POST /api/admin/auth/login should fail with wrong credentials', async () => {
      const response = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@wtg.pl',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
    });

    it('POST /api/admin/auth/login should validate request body', async () => {
      const response = await request(app).post('/api/admin/auth/login').send({
        email: 'not-an-email',
        password: '123', // too short
      });

      expect(response.status).toBe(400);
    });

    it('GET /api/admin/auth/me should return user with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@wtg.pl',
          password: 'admin123',
        });

      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@wtg.pl');
    });

    it('GET /api/admin/auth/me should return 401 without token', async () => {
      const response = await request(app).get('/api/admin/auth/me');

      expect(response.status).toBe(401);
    });

    it('POST /api/admin/auth/refresh should refresh token', async () => {
      // First login to get tokens
      const loginResponse = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@wtg.pl',
          password: 'admin123',
        });

      const response = await request(app).post('/api/admin/auth/refresh').send({
        refreshToken: loginResponse.body.refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });
  });

  describe('Admin Tours Routes (Protected)', () => {
    let accessToken: string;

    beforeAll(async () => {
      // Login to get access token
      const response = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@wtg.pl',
        password: 'admin123',
      });

      accessToken = response.body.accessToken || '';
    });

    it('GET /api/admin/tours should return 401 without auth', async () => {
      const response = await request(app).get('/api/admin/tours');

      expect(response.status).toBe(401);
    });

    it('GET /api/admin/tours should return tours list with auth', async () => {
      const response = await request(app)
        .get('/api/admin/tours')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tours');
      expect(Array.isArray(response.body.tours)).toBe(true);
    });

    it('GET /api/admin/tours/stats should return stats', async () => {
      const response = await request(app)
        .get('/api/admin/tours/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalTours');
      expect(response.body).toHaveProperty('publishedTours');
    });

    it('GET /api/admin/tours/cities should return cities', async () => {
      const response = await request(app)
        .get('/api/admin/tours/cities')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cities');
      expect(Array.isArray(response.body.cities)).toBe(true);
    });
  });
});

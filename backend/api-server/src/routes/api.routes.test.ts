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

  describe('Admin Tours CRUD Operations', () => {
    let accessToken: string;
    let createdTourId: string;

    // Sample tour data for testing
    const sampleTourInput = {
      cityId: 'krakow',
      name: {
        pl: 'Test API Tour',
        en: 'Test API Tour',
        de: 'Test API Tour',
        fr: 'Test API Tour',
        uk: 'Test API Tour',
      },
      description: {
        pl: 'Opis testowej wycieczki API',
        en: 'Test API tour description',
        de: 'Test API Tour Beschreibung',
        fr: 'Description du test API',
        uk: 'Опис тестового API туру',
      },
      category: 'history',
      difficulty: 'easy',
      distance: 2000,
      duration: 3600,
      imageUrl: '/images/test.jpg',
      pois: [],
      status: 'draft',
      featured: false,
    };

    beforeAll(async () => {
      // Login to get access token
      const response = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@wtg.pl',
        password: 'admin123',
      });

      accessToken = response.body.accessToken || '';
    });

    describe('POST /api/admin/tours (Create)', () => {
      it('should create a new tour', async () => {
        const response = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour).toHaveProperty('id');
        expect(response.body.tour.name.pl).toBe('Test API Tour');
        expect(response.body.tour.status).toBe('draft');

        createdTourId = response.body.tour.id;
      });

      it('should return 400 for invalid input', async () => {
        const response = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            cityId: 'krakow',
            // Missing required fields
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Validation Error');
      });

      it('should return 401 without auth', async () => {
        const response = await request(app)
          .post('/api/admin/tours')
          .send(sampleTourInput);

        expect(response.status).toBe(401);
      });
    });

    describe('GET /api/admin/tours/:id (Read)', () => {
      it('should get tour by ID', async () => {
        // First create a tour
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .get(`/api/admin/tours/${tourId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour.id).toBe(tourId);
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .get('/api/admin/tours/non-existent-id')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/admin/tours/:id (Update)', () => {
      it('should update tour', async () => {
        // First create a tour
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .put(`/api/admin/tours/${tourId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: {
              pl: 'Zaktualizowana Wycieczka',
              en: 'Updated Tour',
              de: 'Aktualisierte Tour',
              fr: 'Visite Mise à Jour',
              uk: 'Оновлений тур',
            },
            difficulty: 'hard',
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour.name.pl).toBe('Zaktualizowana Wycieczka');
        expect(response.body.tour.difficulty).toBe('hard');
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .put('/api/admin/tours/non-existent-id')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ difficulty: 'hard' });

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE /api/admin/tours/:id (Delete)', () => {
      it('should delete tour', async () => {
        // First create a tour to delete
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .delete(`/api/admin/tours/${tourId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);

        // Verify tour is deleted
        const getResponse = await request(app)
          .get(`/api/admin/tours/${tourId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(getResponse.status).toBe(404);
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .delete('/api/admin/tours/non-existent-id')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/admin/tours/:id/duplicate', () => {
      it('should duplicate tour', async () => {
        // First create a tour
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .post(`/api/admin/tours/${tourId}/duplicate`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour.id).not.toBe(tourId);
        expect(response.body.tour.name.pl).toContain('(kopia)');
        expect(response.body.tour.status).toBe('draft');
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .post('/api/admin/tours/non-existent-id/duplicate')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/admin/tours/:id/publish', () => {
      it('should publish tour', async () => {
        // First create a draft tour
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...sampleTourInput, status: 'draft' });

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .post(`/api/admin/tours/${tourId}/publish`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour.status).toBe('published');
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .post('/api/admin/tours/non-existent-id/publish')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/admin/tours/:id/archive', () => {
      it('should archive tour', async () => {
        // First create a published tour
        const createResponse = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...sampleTourInput, status: 'published' });

        const tourId = createResponse.body.tour.id;

        const response = await request(app)
          .post(`/api/admin/tours/${tourId}/archive`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tour');
        expect(response.body.tour.status).toBe('archived');
      });

      it('should return 404 for non-existent tour', async () => {
        const response = await request(app)
          .post('/api/admin/tours/non-existent-id/archive')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('POST /api/admin/tours/bulk-delete', () => {
      it('should delete multiple tours', async () => {
        // Create 3 tours
        const tour1 = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tour2 = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const tour3 = await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sampleTourInput);

        const ids = [
          tour1.body.tour.id,
          tour2.body.tour.id,
          tour3.body.tour.id,
        ];

        const response = await request(app)
          .post('/api/admin/tours/bulk-delete')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ids });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('deleted', 3);
      });

      it('should return 400 for invalid input', async () => {
        const response = await request(app)
          .post('/api/admin/tours/bulk-delete')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ids: [] }); // Empty array not allowed

        expect(response.status).toBe(400);
      });

      it('should return 0 deleted for non-existent tours', async () => {
        const response = await request(app)
          .post('/api/admin/tours/bulk-delete')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ids: ['non-existent-1', 'non-existent-2'] });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('deleted', 0);
      });
    });

    describe('Filtering tours', () => {
      it('should filter tours by cityId', async () => {
        const response = await request(app)
          .get('/api/admin/tours')
          .query({ cityId: 'krakow' })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        response.body.tours.forEach((tour: { cityId: string }) => {
          expect(tour.cityId).toBe('krakow');
        });
      });

      it('should filter tours by status', async () => {
        const response = await request(app)
          .get('/api/admin/tours')
          .query({ status: 'published' })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        response.body.tours.forEach((tour: { status: string }) => {
          expect(tour.status).toBe('published');
        });
      });

      it('should search tours by name', async () => {
        // First create a tour with unique name
        await request(app)
          .post('/api/admin/tours')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            ...sampleTourInput,
            name: {
              pl: 'UniqueSearchTerm123',
              en: 'UniqueSearchTerm123',
              de: 'UniqueSearchTerm123',
              fr: 'UniqueSearchTerm123',
              uk: 'UniqueSearchTerm123',
            },
          });

        const response = await request(app)
          .get('/api/admin/tours')
          .query({ search: 'UniqueSearchTerm123' })
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.tours.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

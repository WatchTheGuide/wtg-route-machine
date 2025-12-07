/**
 * Tours Service Tests
 */
import { describe, it, expect } from 'vitest';
import { toursService } from './tours.service.js';

describe('Tours Service', () => {
  describe('getCities', () => {
    it('should return list of cities with tour counts', async () => {
      const cities = await toursService.getCities();

      expect(cities).toBeDefined();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);

      // Check structure
      cities.forEach((city) => {
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('toursCount');
        expect(typeof city.id).toBe('string');
        expect(typeof city.name).toBe('string');
        expect(typeof city.toursCount).toBe('number');
      });
    });

    it('should include Kraków in the cities list', async () => {
      const cities = await toursService.getCities();
      const krakow = cities.find((c) => c.id === 'krakow');

      expect(krakow).toBeDefined();
      expect(krakow?.name).toBe('Kraków');
      expect(krakow?.toursCount).toBeGreaterThan(0);
    });

    it('should include all 4 cities', async () => {
      const cities = await toursService.getCities();
      expect(cities.length).toBe(4);

      const cityIds = cities.map((c) => c.id);
      expect(cityIds).toContain('krakow');
      expect(cityIds).toContain('warszawa');
      expect(cityIds).toContain('wroclaw');
      expect(cityIds).toContain('trojmiasto');
    });
  });

  describe('getToursByCity', () => {
    it('should return tours for Kraków', async () => {
      const tours = await toursService.getToursByCity('krakow');

      expect(tours).toBeDefined();
      expect(Array.isArray(tours)).toBe(true);
      expect(tours.length).toBeGreaterThan(0);

      // Check structure (TourSummary)
      tours.forEach((tour) => {
        expect(tour).toHaveProperty('id');
        expect(tour).toHaveProperty('name');
        expect(tour).toHaveProperty('description');
        expect(tour).toHaveProperty('category');
        expect(tour).toHaveProperty('difficulty');
        expect(tour).toHaveProperty('duration');
        expect(tour).toHaveProperty('distance');
      });
    });

    it('should throw error for unknown city', async () => {
      await expect(toursService.getToursByCity('unknown-city')).rejects.toThrow(
        'Invalid city ID'
      );
    });
  });

  describe('getTourById', () => {
    it('should return tour by ID', async () => {
      // First get a valid tour ID
      const tours = await toursService.getToursByCity('krakow');
      expect(tours.length).toBeGreaterThan(0);

      const firstTour = tours[0];
      const tour = await toursService.getTourById('krakow', firstTour.id);

      expect(tour).toBeDefined();
      expect(tour).not.toBeNull();
      expect(tour?.id).toBe(firstTour.id);
    });

    it('should return null for unknown tour ID', async () => {
      const tour = await toursService.getTourById('krakow', 'unknown-tour-id');
      expect(tour).toBeNull();
    });

    it('should throw error for unknown city', async () => {
      await expect(
        toursService.getTourById('unknown-city', 'some-id')
      ).rejects.toThrow('Invalid city ID');
    });
  });

  describe('searchTours', () => {
    it('should search tours by query', async () => {
      // Get all tours first to find a keyword
      const tours = await toursService.getToursByCity('krakow');
      expect(tours.length).toBeGreaterThan(0);

      // Search for something that should exist
      const results = await toursService.searchTours('krakow', 'royal');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should throw error for unknown city', async () => {
      await expect(
        toursService.searchTours('unknown-city', 'test')
      ).rejects.toThrow('Invalid city ID');
    });
  });
});

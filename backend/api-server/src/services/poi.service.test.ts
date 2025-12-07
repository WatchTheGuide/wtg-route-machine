/**
 * POI Service Tests
 */
import { describe, it, expect } from 'vitest';
import {
  getCities,
  loadCategories,
  getPOIsForCity,
  getPOI,
  searchPOIs,
  getNearbyPOIs,
} from './poi.service.js';
import type { CityInfo, CategoryInfo, POI } from '../types/index.js';

describe('POI Service', () => {
  describe('getCities', () => {
    it('should return list of cities with POI counts', () => {
      const cities = getCities();

      expect(cities).toBeDefined();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);

      // Check structure
      cities.forEach((city: CityInfo) => {
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('poiCount');
        expect(typeof city.id).toBe('string');
        expect(typeof city.name).toBe('string');
        expect(typeof city.poiCount).toBe('number');
      });
    });

    it('should include Kraków in the cities list', () => {
      const cities = getCities();
      const krakow = cities.find((c: CityInfo) => c.id === 'krakow');

      expect(krakow).toBeDefined();
      expect(krakow?.name).toBe('Kraków');
      expect(krakow?.poiCount).toBeGreaterThan(0);
    });
  });

  describe('loadCategories', () => {
    it('should return list of POI categories', () => {
      const categories = loadCategories();

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);

      // Check structure
      categories.forEach((cat: CategoryInfo) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('icon');
        expect(cat).toHaveProperty('color');
      });
    });
  });

  describe('getPOIsForCity', () => {
    it('should return POIs for Kraków', () => {
      const pois = getPOIsForCity('krakow');

      expect(pois).toBeDefined();
      expect(pois).not.toBeNull();
      expect(Array.isArray(pois)).toBe(true);
      expect(pois!.length).toBeGreaterThan(0);

      // Check structure
      pois!.forEach((poi: POI) => {
        expect(poi).toHaveProperty('id');
        expect(poi).toHaveProperty('name');
        expect(poi).toHaveProperty('category');
        expect(poi).toHaveProperty('coordinates');
        expect(Array.isArray(poi.coordinates)).toBe(true);
        expect(poi.coordinates.length).toBe(2);
      });
    });

    it('should return null for unknown city', () => {
      const pois = getPOIsForCity('unknown-city');
      expect(pois).toBeNull();
    });

    it('should filter by category', () => {
      const pois = getPOIsForCity('krakow', ['museum']);

      expect(pois).toBeDefined();
      expect(pois).not.toBeNull();
      pois!.forEach((poi: POI) => {
        expect(poi.category).toBe('museum');
      });
    });
  });

  describe('getPOI', () => {
    it('should return POI by ID', () => {
      // First get a valid POI ID
      const pois = getPOIsForCity('krakow');
      expect(pois).not.toBeNull();
      expect(pois!.length).toBeGreaterThan(0);

      const firstPoi = pois![0];
      const foundPoi = getPOI('krakow', firstPoi.id);

      expect(foundPoi).toBeDefined();
      expect(foundPoi?.id).toBe(firstPoi.id);
      expect(foundPoi?.name).toBe(firstPoi.name);
    });

    it('should return null for unknown POI ID', () => {
      const poi = getPOI('krakow', 'unknown-poi-id');
      expect(poi).toBeNull();
    });
  });

  describe('searchPOIs', () => {
    it('should search POIs by query', () => {
      const results = searchPOIs('krakow', 'wawel');

      expect(results).toBeDefined();
      expect(results).not.toBeNull();
      expect(Array.isArray(results)).toBe(true);
      // Wawel should be found in Kraków
      expect(results!.length).toBeGreaterThan(0);
    });

    it('should return null for unknown city', () => {
      const results = searchPOIs('unknown-city', 'test');
      expect(results).toBeNull();
    });
  });

  describe('getNearbyPOIs', () => {
    it('should return nearby POIs within radius', () => {
      // Kraków Main Square coordinates
      const lat = 50.0617;
      const lon = 19.9373;
      const radius = 1000; // 1000 meters

      const results = getNearbyPOIs('krakow', lat, lon, radius);

      expect(results).toBeDefined();
      expect(results).not.toBeNull();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return null for unknown city', () => {
      const results = getNearbyPOIs('unknown-city', 50.0, 19.0, 500);
      expect(results).toBeNull();
    });
  });
});

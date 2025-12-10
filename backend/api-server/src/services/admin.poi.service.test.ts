/**
 * Admin POI Service Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createPOI,
  getPOIById,
  updatePOI,
  deletePOI,
  bulkDeletePOIs,
  getAllPOIs,
  getPOIsForCity,
  getPOICountByCity,
  getCategories,
  getTotalPOICount,
  poiExists,
  type CreatePOIInput,
  type POICategoryDB,
} from './admin.poi.service.js';
import { db } from '../db/index.js';
import { pois } from '../db/schema/index.js';

// Clean up before each test
beforeEach(async () => {
  await db.delete(pois);
});

const validPOIInput: CreatePOIInput = {
  cityId: 'krakow',
  namePl: 'Testowy POI',
  nameEn: 'Test POI',
  descriptionPl: 'Opis testowego POI',
  descriptionEn: 'Test POI description',
  category: 'museum',
  latitude: 50.0647,
  longitude: 19.945,
  address: 'Test Address 123',
};

describe('Admin POI Service', () => {
  describe('createPOI', () => {
    it('should create a new POI with valid input', async () => {
      const poi = await createPOI(validPOIInput);

      expect(poi).toBeDefined();
      expect(poi.id).toBeDefined();
      expect(poi.cityId).toBe('krakow');
      expect(poi.namePl).toBe('Testowy POI');
      expect(poi.nameEn).toBe('Test POI');
      expect(poi.category).toBe('museum');
      expect(poi.latitude).toBe(50.0647);
      expect(poi.longitude).toBe(19.945);
      expect(poi.createdAt).toBeDefined();
      expect(poi.updatedAt).toBeDefined();
    });

    it('should create POI with minimal required fields', async () => {
      const minimalInput: CreatePOIInput = {
        cityId: 'warszawa',
        namePl: 'Minimal POI',
        category: 'monument',
        latitude: 52.2297,
        longitude: 21.0122,
      };

      const poi = await createPOI(minimalInput);

      expect(poi).toBeDefined();
      expect(poi.namePl).toBe('Minimal POI');
      expect(poi.nameEn).toBeNull();
      expect(poi.descriptionPl).toBeNull();
    });

    it('should create POI with all categories', async () => {
      const categories: POICategoryDB[] = [
        'historical',
        'religious',
        'museum',
        'park',
        'restaurant',
        'cafe',
        'shopping',
        'entertainment',
        'viewpoint',
        'monument',
        'other',
      ];

      for (const category of categories) {
        const poi = await createPOI({
          ...validPOIInput,
          namePl: `POI ${category}`,
          category,
        });

        expect(poi.category).toBe(category);
      }
    });
  });

  describe('getPOIById', () => {
    it('should return POI by ID', async () => {
      const created = await createPOI(validPOIInput);
      const found = await getPOIById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.namePl).toBe('Testowy POI');
    });

    it('should return null for non-existent ID', async () => {
      const found = await getPOIById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('updatePOI', () => {
    it('should update POI name', async () => {
      const created = await createPOI(validPOIInput);
      const updated = await updatePOI(created.id, {
        namePl: 'Zaktualizowany POI',
      });

      expect(updated).toBeDefined();
      expect(updated?.namePl).toBe('Zaktualizowany POI');
      expect(updated?.category).toBe('museum'); // unchanged
    });

    it('should update POI category', async () => {
      const created = await createPOI(validPOIInput);
      const updated = await updatePOI(created.id, {
        category: 'park',
      });

      expect(updated?.category).toBe('park');
    });

    it('should update POI coordinates', async () => {
      const created = await createPOI(validPOIInput);
      const updated = await updatePOI(created.id, {
        latitude: 51.1079,
        longitude: 17.0385,
      });

      expect(updated?.latitude).toBe(51.1079);
      expect(updated?.longitude).toBe(17.0385);
    });

    it('should return null when updating non-existent POI', async () => {
      const result = await updatePOI('non-existent-id', {
        namePl: 'Test',
      });

      expect(result).toBeNull();
    });

    it('should update updatedAt timestamp', async () => {
      const created = await createPOI(validPOIInput);

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await updatePOI(created.id, {
        namePl: 'Updated Name',
      });

      expect(updated?.updatedAt).not.toBe(created.updatedAt);
    });
  });

  describe('deletePOI', () => {
    it('should delete existing POI', async () => {
      const created = await createPOI(validPOIInput);
      const deleted = await deletePOI(created.id);

      expect(deleted).toBe(true);

      const found = await getPOIById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent POI', async () => {
      const deleted = await deletePOI('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('bulkDeletePOIs', () => {
    it('should delete multiple POIs', async () => {
      const poi1 = await createPOI({ ...validPOIInput, namePl: 'POI 1' });
      const poi2 = await createPOI({ ...validPOIInput, namePl: 'POI 2' });
      const poi3 = await createPOI({ ...validPOIInput, namePl: 'POI 3' });

      const deleted = await bulkDeletePOIs([poi1.id, poi2.id, poi3.id]);

      expect(deleted).toBe(3);
    });

    it('should count only actually deleted POIs', async () => {
      const poi1 = await createPOI({ ...validPOIInput, namePl: 'POI 1' });

      const deleted = await bulkDeletePOIs([
        poi1.id,
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(deleted).toBe(1);
    });

    it('should return 0 when no POIs exist', async () => {
      const deleted = await bulkDeletePOIs(['id1', 'id2']);
      expect(deleted).toBe(0);
    });
  });

  describe('getAllPOIs', () => {
    beforeEach(async () => {
      // Create test POIs
      await createPOI({
        ...validPOIInput,
        cityId: 'krakow',
        category: 'museum',
      });
      await createPOI({
        ...validPOIInput,
        cityId: 'warszawa',
        namePl: 'Warszawa POI',
        category: 'park',
      });
      await createPOI({
        ...validPOIInput,
        cityId: 'krakow',
        namePl: 'Drugi Krakowski',
        category: 'restaurant',
      });
    });

    it('should return all POIs', async () => {
      const allPOIs = await getAllPOIs();

      expect(allPOIs).toHaveLength(3);
    });

    it('should filter by cityId', async () => {
      const krakowPOIs = await getAllPOIs({ cityId: 'krakow' });

      expect(krakowPOIs).toHaveLength(2);
      krakowPOIs.forEach((poi) => {
        expect(poi.cityId).toBe('krakow');
      });
    });

    it('should filter by category', async () => {
      const museums = await getAllPOIs({ category: 'museum' });

      expect(museums).toHaveLength(1);
      expect(museums[0].category).toBe('museum');
    });

    it('should filter by search query', async () => {
      const results = await getAllPOIs({ search: 'Warszawa' });

      expect(results).toHaveLength(1);
      expect(results[0].namePl).toBe('Warszawa POI');
    });

    it('should combine filters', async () => {
      const results = await getAllPOIs({
        cityId: 'krakow',
        category: 'museum',
      });

      expect(results).toHaveLength(1);
    });
  });

  describe('getPOIsForCity', () => {
    it('should return POIs for specific city', async () => {
      await createPOI({ ...validPOIInput, cityId: 'krakow' });
      await createPOI({ ...validPOIInput, cityId: 'krakow', namePl: 'POI 2' });
      await createPOI({
        ...validPOIInput,
        cityId: 'warszawa',
        namePl: 'POI 3',
      });

      const krakowPOIs = await getPOIsForCity('krakow');

      expect(krakowPOIs).toHaveLength(2);
    });

    it('should return empty array for city without POIs', async () => {
      const pois = await getPOIsForCity('wroclaw');
      expect(pois).toHaveLength(0);
    });
  });

  describe('getPOICountByCity', () => {
    it('should return POI counts grouped by city', async () => {
      await createPOI({ ...validPOIInput, cityId: 'krakow' });
      await createPOI({ ...validPOIInput, cityId: 'krakow', namePl: 'POI 2' });
      await createPOI({
        ...validPOIInput,
        cityId: 'warszawa',
        namePl: 'POI 3',
      });

      const counts = await getPOICountByCity();

      expect(counts).toHaveLength(2);

      const krakowCount = counts.find((c) => c.cityId === 'krakow');
      expect(krakowCount?.count).toBe(2);

      const warszawaCount = counts.find((c) => c.cityId === 'warszawa');
      expect(warszawaCount?.count).toBe(1);
    });
  });

  describe('getCategories', () => {
    it('should return all available categories', () => {
      const categories = getCategories();

      expect(categories).toContain('historical');
      expect(categories).toContain('museum');
      expect(categories).toContain('park');
      expect(categories).toContain('other');
      expect(categories.length).toBe(11);
    });
  });

  describe('getTotalPOICount', () => {
    it('should return total POI count', async () => {
      await createPOI({ ...validPOIInput, namePl: 'POI 1' });
      await createPOI({ ...validPOIInput, namePl: 'POI 2' });
      await createPOI({ ...validPOIInput, namePl: 'POI 3' });

      const count = await getTotalPOICount();

      expect(count).toBe(3);
    });

    it('should return 0 when no POIs', async () => {
      const count = await getTotalPOICount();
      expect(count).toBe(0);
    });
  });

  describe('poiExists', () => {
    it('should return true for existing POI', async () => {
      const created = await createPOI(validPOIInput);
      const exists = await poiExists(created.id);

      expect(exists).toBe(true);
    });

    it('should return false for non-existent POI', async () => {
      const exists = await poiExists('non-existent-id');
      expect(exists).toBe(false);
    });
  });
});

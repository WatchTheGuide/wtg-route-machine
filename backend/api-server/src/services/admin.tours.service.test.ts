/**
 * Admin Tours Service Tests
 * Tests for CRUD operations on tours
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { adminToursService } from './admin.tours.service.js';
import type { TourInput } from '../types/index.js';

// Sample tour input for testing
const createSampleTourInput = (overrides?: Partial<TourInput>): TourInput => ({
  cityId: 'krakow',
  name: {
    pl: 'Testowa Wycieczka',
    en: 'Test Tour',
    de: 'Testtour',
    fr: 'Visite Test',
    uk: 'Тестова екскурсія',
  },
  description: {
    pl: 'Opis testowej wycieczki',
    en: 'Test tour description',
    de: 'Beschreibung der Testtour',
    fr: 'Description de la visite test',
    uk: 'Опис тестової екскурсії',
  },
  category: 'history',
  difficulty: 'easy',
  distance: 1500,
  duration: 3600,
  imageUrl: '/images/test-tour.jpg',
  pois: [],
  status: 'draft',
  featured: false,
  mediaIds: [],
  ...overrides,
});

describe('Admin Tours Service', () => {
  describe('createTour', () => {
    it('should create a new tour with valid input', async () => {
      const input = createSampleTourInput();
      const tour = await adminToursService.createTour(input);

      expect(tour).toBeDefined();
      expect(tour.id).toBeDefined();
      expect(tour.id).toMatch(/^tour-/);
      expect(tour.cityId).toBe('krakow');
      expect(tour.name.pl).toBe('Testowa Wycieczka');
      expect(tour.name.en).toBe('Test Tour');
      expect(tour.status).toBe('draft');
      expect(tour.featured).toBe(false);
      expect(tour.views).toBe(0);
      expect(tour.createdAt).toBeDefined();
      expect(tour.updatedAt).toBeDefined();
    });

    it('should default to draft status if not provided', async () => {
      const input = createSampleTourInput();
      // Remove status to test default behavior
      const { status, ...inputWithoutStatus } = input;

      const tour = await adminToursService.createTour(
        inputWithoutStatus as TourInput
      );

      expect(tour.status).toBe('draft');
    });

    it('should create tour with published status', async () => {
      const input = createSampleTourInput({ status: 'published' });
      const tour = await adminToursService.createTour(input);

      expect(tour.status).toBe('published');
    });

    it('should create featured tour', async () => {
      const input = createSampleTourInput({ featured: true });
      const tour = await adminToursService.createTour(input);

      expect(tour.featured).toBe(true);
    });
  });

  describe('getTourById', () => {
    it('should return tour by ID', async () => {
      const input = createSampleTourInput();
      const created = await adminToursService.createTour(input);

      const found = await adminToursService.getTourById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name.pl).toBe(input.name.pl);
    });

    it('should return null for non-existent ID', async () => {
      const found = await adminToursService.getTourById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('updateTour', () => {
    it('should update tour name', async () => {
      const input = createSampleTourInput();
      const created = await adminToursService.createTour(input);

      // Small delay to ensure updatedAt changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const newName = {
        pl: 'Zaktualizowana Wycieczka',
        en: 'Updated Tour',
        de: 'Aktualisierte Tour',
        fr: 'Visite Mise à Jour',
        uk: 'Оновлена екскурсія',
      };

      const updated = await adminToursService.updateTour(created.id, {
        name: newName,
      });

      expect(updated).not.toBeNull();
      expect(updated?.name.pl).toBe('Zaktualizowana Wycieczka');
      expect(updated?.name.en).toBe('Updated Tour');
      // updatedAt should be different (or at least >= created)
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(created.updatedAt).getTime()
      );
    });

    it('should update tour status', async () => {
      const input = createSampleTourInput({ status: 'draft' });
      const created = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(created.id, {
        status: 'published',
      });

      expect(updated?.status).toBe('published');
    });

    it('should update tour difficulty', async () => {
      const input = createSampleTourInput({ difficulty: 'easy' });
      const created = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(created.id, {
        difficulty: 'hard',
      });

      expect(updated?.difficulty).toBe('hard');
    });

    it('should update distance and duration', async () => {
      const input = createSampleTourInput();
      const created = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(created.id, {
        distance: 5000,
        duration: 7200,
      });

      expect(updated?.distance).toBe(5000);
      expect(updated?.duration).toBe(7200);
    });

    it('should return null when updating non-existent tour', async () => {
      const updated = await adminToursService.updateTour('non-existent-id', {
        status: 'published',
      });

      expect(updated).toBeNull();
    });

    it('should preserve other fields when updating partially', async () => {
      const input = createSampleTourInput({
        cityId: 'warszawa',
        category: 'architecture',
      });
      const created = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(created.id, {
        featured: true,
      });

      expect(updated?.cityId).toBe('warszawa');
      expect(updated?.category).toBe('architecture');
      expect(updated?.featured).toBe(true);
    });
  });

  describe('deleteTour', () => {
    it('should delete existing tour', async () => {
      const input = createSampleTourInput();
      const created = await adminToursService.createTour(input);

      const deleted = await adminToursService.deleteTour(created.id);

      expect(deleted).toBe(true);

      const found = await adminToursService.getTourById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent tour', async () => {
      const deleted = await adminToursService.deleteTour('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple tours', async () => {
      const tour1 = await adminToursService.createTour(
        createSampleTourInput({ cityId: 'krakow' })
      );
      const tour2 = await adminToursService.createTour(
        createSampleTourInput({ cityId: 'warszawa' })
      );
      const tour3 = await adminToursService.createTour(
        createSampleTourInput({ cityId: 'wroclaw' })
      );

      const result = await adminToursService.bulkDelete([
        tour1.id,
        tour2.id,
        tour3.id,
      ]);

      expect(result.deleted).toBe(3);

      expect(await adminToursService.getTourById(tour1.id)).toBeNull();
      expect(await adminToursService.getTourById(tour2.id)).toBeNull();
      expect(await adminToursService.getTourById(tour3.id)).toBeNull();
    });

    it('should count only actually deleted tours', async () => {
      const tour = await adminToursService.createTour(createSampleTourInput());

      const result = await adminToursService.bulkDelete([
        tour.id,
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(result.deleted).toBe(1);
    });

    it('should return 0 when no tours exist', async () => {
      const result = await adminToursService.bulkDelete([
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(result.deleted).toBe(0);
    });
  });

  describe('duplicateTour', () => {
    it('should duplicate tour with new ID', async () => {
      const input = createSampleTourInput({
        status: 'published',
        featured: true,
      });
      const original = await adminToursService.createTour(input);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate).not.toBeNull();
      expect(duplicate?.id).not.toBe(original.id);
      expect(duplicate?.id).toMatch(/^tour-/);
    });

    it('should add copy suffix to name', async () => {
      const input = createSampleTourInput();
      const original = await adminToursService.createTour(input);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate?.name.pl).toBe('Testowa Wycieczka (kopia)');
      expect(duplicate?.name.en).toBe('Test Tour (copy)');
      expect(duplicate?.name.de).toBe('Testtour (Kopie)');
      expect(duplicate?.name.fr).toBe('Visite Test (copie)');
      expect(duplicate?.name.uk).toBe('Тестова екскурсія (копія)');
    });

    it('should reset status to draft', async () => {
      const input = createSampleTourInput({ status: 'published' });
      const original = await adminToursService.createTour(input);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate?.status).toBe('draft');
    });

    it('should reset featured to false', async () => {
      const input = createSampleTourInput({ featured: true });
      const original = await adminToursService.createTour(input);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate?.featured).toBe(false);
    });

    it('should reset views to 0', async () => {
      const input = createSampleTourInput();
      const original = await adminToursService.createTour(input);
      // Manually set views (in real scenario this would be done through increments)
      const updated = await adminToursService.getTourById(original.id);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate?.views).toBe(0);
    });

    it('should return null when duplicating non-existent tour', async () => {
      const duplicate = await adminToursService.duplicateTour(
        'non-existent-id'
      );
      expect(duplicate).toBeNull();
    });
  });

  describe('publishTour', () => {
    it('should change status to published', async () => {
      const input = createSampleTourInput({ status: 'draft' });
      const created = await adminToursService.createTour(input);

      const published = await adminToursService.publishTour(created.id);

      expect(published?.status).toBe('published');
    });

    it('should return null for non-existent tour', async () => {
      const result = await adminToursService.publishTour('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('archiveTour', () => {
    it('should change status to archived', async () => {
      const input = createSampleTourInput({ status: 'published' });
      const created = await adminToursService.createTour(input);

      const archived = await adminToursService.archiveTour(created.id);

      expect(archived?.status).toBe('archived');
    });

    it('should return null for non-existent tour', async () => {
      const result = await adminToursService.archiveTour('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllTours', () => {
    it('should return all tours', async () => {
      // Create a few tours
      await adminToursService.createTour(createSampleTourInput());
      await adminToursService.createTour(
        createSampleTourInput({ cityId: 'warszawa' })
      );

      const tours = await adminToursService.getAllTours();

      expect(tours).toBeDefined();
      expect(Array.isArray(tours)).toBe(true);
      expect(tours.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by cityId', async () => {
      await adminToursService.createTour(
        createSampleTourInput({ cityId: 'wroclaw' })
      );
      await adminToursService.createTour(
        createSampleTourInput({ cityId: 'krakow' })
      );

      const tours = await adminToursService.getAllTours({ cityId: 'wroclaw' });

      tours.forEach((tour) => {
        expect(tour.cityId).toBe('wroclaw');
      });
    });

    it('should filter by status', async () => {
      await adminToursService.createTour(
        createSampleTourInput({ status: 'published' })
      );
      await adminToursService.createTour(
        createSampleTourInput({ status: 'draft' })
      );

      const tours = await adminToursService.getAllTours({
        status: 'published',
      });

      tours.forEach((tour) => {
        expect(tour.status).toBe('published');
      });
    });

    it('should filter by category', async () => {
      await adminToursService.createTour(
        createSampleTourInput({ category: 'architecture' })
      );
      await adminToursService.createTour(
        createSampleTourInput({ category: 'history' })
      );

      const tours = await adminToursService.getAllTours({
        category: 'architecture',
      });

      tours.forEach((tour) => {
        expect(tour.category).toBe('architecture');
      });
    });

    it('should filter by difficulty', async () => {
      await adminToursService.createTour(
        createSampleTourInput({ difficulty: 'hard' })
      );
      await adminToursService.createTour(
        createSampleTourInput({ difficulty: 'easy' })
      );

      const tours = await adminToursService.getAllTours({ difficulty: 'hard' });

      tours.forEach((tour) => {
        expect(tour.difficulty).toBe('hard');
      });
    });

    it('should filter by search query', async () => {
      await adminToursService.createTour(
        createSampleTourInput({
          name: {
            pl: 'Unikalna Nazwa',
            en: 'Unique Name',
            de: 'Einzigartiger Name',
            fr: 'Nom Unique',
            uk: 'Унікальна назва',
          },
        })
      );

      const tours = await adminToursService.getAllTours({ search: 'unikalna' });

      expect(tours.length).toBeGreaterThanOrEqual(1);
      expect(tours.some((t) => t.name.pl.includes('Unikalna'))).toBe(true);
    });

    it('should return tour summaries with poisCount', async () => {
      const input = createSampleTourInput();
      input.pois = [
        {
          id: 'poi-1',
          name: { pl: 'Test POI' },
          description: { pl: 'Test' },
          category: 'museum',
          coordinate: [19.9, 50.0],
          address: 'Test Address',
        },
        {
          id: 'poi-2',
          name: { pl: 'Test POI 2' },
          description: { pl: 'Test 2' },
          category: 'church',
          coordinate: [19.91, 50.01],
          address: 'Test Address 2',
        },
      ];

      const created = await adminToursService.createTour(input);
      const tours = await adminToursService.getAllTours();

      const found = tours.find((t) => t.id === created.id);
      expect(found?.poisCount).toBe(2);
    });
  });

  describe('getCities', () => {
    it('should return all 4 cities', async () => {
      const cities = await adminToursService.getCities();

      expect(cities).toBeDefined();
      expect(cities.length).toBe(4);

      const cityIds = cities.map((c) => c.id);
      expect(cityIds).toContain('krakow');
      expect(cityIds).toContain('warszawa');
      expect(cityIds).toContain('wroclaw');
      expect(cityIds).toContain('trojmiasto');
    });

    it('should include tour counts', async () => {
      const cities = await adminToursService.getCities();

      cities.forEach((city) => {
        expect(city).toHaveProperty('toursCount');
        expect(typeof city.toursCount).toBe('number');
      });
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const stats = await adminToursService.getStats();

      expect(stats).toHaveProperty('totalTours');
      expect(stats).toHaveProperty('publishedTours');
      expect(stats).toHaveProperty('draftTours');
      expect(stats).toHaveProperty('archivedTours');
      expect(stats).toHaveProperty('featuredTours');
      expect(stats).toHaveProperty('totalViews');
      expect(stats).toHaveProperty('toursByCity');
      expect(stats).toHaveProperty('toursByCategory');
    });

    it('should count tours correctly', async () => {
      // Get initial stats
      const initialStats = await adminToursService.getStats();
      const initialTotal = initialStats.totalTours;

      // Create new tours
      await adminToursService.createTour(
        createSampleTourInput({ status: 'published' })
      );
      await adminToursService.createTour(
        createSampleTourInput({ status: 'draft' })
      );

      const stats = await adminToursService.getStats();

      expect(stats.totalTours).toBe(initialTotal + 2);
      expect(stats.publishedTours).toBeGreaterThanOrEqual(1);
      expect(stats.draftTours).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Tour Media Integration (US 8.16)', () => {
    it('should create tour with mediaIds', async () => {
      const input = createSampleTourInput({
        mediaIds: ['media-1', 'media-2', 'media-3'],
        primaryMediaId: 'media-1',
      });
      const tour = await adminToursService.createTour(input);

      expect(tour.mediaIds).toEqual(['media-1', 'media-2', 'media-3']);
      expect(tour.primaryMediaId).toBe('media-1');
    });

    it('should create tour with empty mediaIds by default', async () => {
      const input = createSampleTourInput();
      const tour = await adminToursService.createTour(input);

      expect(tour.mediaIds).toEqual([]);
      expect(tour.primaryMediaId).toBeUndefined();
    });

    it('should update tour mediaIds', async () => {
      const input = createSampleTourInput();
      const tour = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(tour.id, {
        mediaIds: ['new-media-1', 'new-media-2'],
        primaryMediaId: 'new-media-1',
      });

      expect(updated).toBeDefined();
      expect(updated!.mediaIds).toEqual(['new-media-1', 'new-media-2']);
      expect(updated!.primaryMediaId).toBe('new-media-1');
    });

    it('should preserve mediaIds when updating other fields', async () => {
      const input = createSampleTourInput({
        mediaIds: ['media-1'],
        primaryMediaId: 'media-1',
      });
      const tour = await adminToursService.createTour(input);

      const updated = await adminToursService.updateTour(tour.id, {
        name: { ...tour.name, pl: 'Nowa nazwa' },
      });

      expect(updated!.mediaIds).toEqual(['media-1']);
      expect(updated!.primaryMediaId).toBe('media-1');
    });

    it('should clear primaryMediaId when set to null', async () => {
      const input = createSampleTourInput({
        mediaIds: ['media-1'],
        primaryMediaId: 'media-1',
      });
      const tour = await adminToursService.createTour(input);

      // Note: In Drizzle, undefined means "don't update", null means "set to null"
      const updated = await adminToursService.updateTour(tour.id, {
        primaryMediaId: null as unknown as undefined, // Workaround for TypeScript
      });

      // After clearing, it should be undefined (null in DB mapped to undefined)
      expect(updated!.primaryMediaId).toBeFalsy();
    });

    it('should duplicate tour with mediaIds', async () => {
      const input = createSampleTourInput({
        mediaIds: ['media-1', 'media-2'],
        primaryMediaId: 'media-1',
      });
      const original = await adminToursService.createTour(input);

      const duplicate = await adminToursService.duplicateTour(original.id);

      expect(duplicate).toBeDefined();
      expect(duplicate!.id).not.toBe(original.id);
      expect(duplicate!.mediaIds).toEqual(['media-1', 'media-2']);
      expect(duplicate!.primaryMediaId).toBe('media-1');
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  poiService,
  fetchPOIs,
  fetchPOI,
  fetchCategories,
  searchPOIs,
} from './poi.service';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('poiService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('fetchPOIs', () => {
    it('should fetch POIs for a city', async () => {
      const mockPOIs = [
        {
          id: 'poi1',
          name: 'Test POI',
          category: 'landmark',
          coordinate: [19.9, 50.0],
        },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPOIs),
      });

      const result = await fetchPOIs('krakow');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/krakow'),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test POI');
    });

    it('should filter by category', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchPOIs('krakow', 'museum');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category=museum'),
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchPOIs('nieznane')).rejects.toThrow(
        'Błąd pobierania POI'
      );
    });
  });

  describe('fetchPOI', () => {
    it('should fetch single POI', async () => {
      const mockPOI = {
        id: 'wawel',
        name: 'Wawel',
        category: 'landmark',
        coordinate: [19.9, 50.0],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPOI),
      });

      const result = await fetchPOI('krakow', 'wawel');

      expect(result.id).toBe('wawel');
      expect(result.name).toBe('Wawel');
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [
        { id: 'landmark', name: 'Zabytki', icon: '🏛️', color: '#3B82F6' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      });

      const result = await fetchCategories();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('landmark');
    });
  });

  describe('searchPOIs', () => {
    it('should search POIs', async () => {
      const mockResults = [
        {
          id: 'wawel',
          name: 'Wawel',
          category: 'landmark',
          coordinate: [19.9, 50.0],
        },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      });

      const result = await searchPOIs('krakow', 'wawel');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search?q=wawel'),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('poiService singleton', () => {
    it('should have all methods', () => {
      expect(poiService.fetchPOIs).toBeDefined();
      expect(poiService.fetchPOI).toBeDefined();
      expect(poiService.fetchCategories).toBeDefined();
      expect(poiService.searchPOIs).toBeDefined();
      expect(poiService.fetchCurrentCityPOIs).toBeDefined();
    });
  });
});

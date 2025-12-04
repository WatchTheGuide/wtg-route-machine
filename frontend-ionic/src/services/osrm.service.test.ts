/**
 * Tests for OSRM Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  osrmService,
  decodePolyline,
  getManeuverIcon,
  OsrmError,
} from './osrm.service';

describe('osrmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('decodePolyline', () => {
    it('should decode a simple polyline correctly', () => {
      // Encoded polyline for approximately [(0, 0), (0.00001, 0.00001)]
      const encoded = '??_ibE_ibE';
      const decoded = decodePolyline(encoded, 5);

      expect(decoded.length).toBeGreaterThan(0);
      expect(decoded[0]).toHaveLength(2);
    });

    it('should return empty array for empty string', () => {
      const decoded = decodePolyline('');
      expect(decoded).toEqual([]);
    });

    it('should handle different precision values', () => {
      // Test with a complex polyline
      const encoded = '_p~iF~ps|U_ulLnnqC';
      const decoded5 = decodePolyline(encoded, 5);
      const decoded6 = decodePolyline(encoded, 6);

      // Both should decode coordinates, but with different scaling
      expect(decoded5.length).toBeGreaterThan(0);
      expect(decoded6.length).toBeGreaterThan(0);
    });
  });

  describe('getManeuverIcon', () => {
    it('should return play icon for depart', () => {
      const icon = getManeuverIcon({
        type: 'depart',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('play-circle-outline');
    });

    it('should return flag icon for arrive', () => {
      const icon = getManeuverIcon({
        type: 'arrive',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('flag-outline');
    });

    it('should return left arrow for left turn', () => {
      const icon = getManeuverIcon({
        type: 'turn',
        modifier: 'left',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('arrow-back-outline');
    });

    it('should return right arrow for right turn', () => {
      const icon = getManeuverIcon({
        type: 'turn',
        modifier: 'right',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('arrow-forward-outline');
    });

    it('should return sync icon for roundabout', () => {
      const icon = getManeuverIcon({
        type: 'roundabout',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('sync-outline');
    });

    it('should return default navigate icon for unknown type', () => {
      const icon = getManeuverIcon({
        type: 'unknown',
        location: [0, 0],
        bearing_before: 0,
        bearing_after: 0,
      });
      expect(icon).toBe('navigate-outline');
    });
  });

  describe('calculateRoute', () => {
    it('should throw error when less than 2 waypoints provided', async () => {
      await expect(osrmService.calculateRoute([[19.9, 50.0]])).rejects.toThrow(
        'At least 2 waypoints required'
      );
    });

    it('should throw error when no waypoints provided', async () => {
      await expect(osrmService.calculateRoute([])).rejects.toThrow(
        'At least 2 waypoints required'
      );
    });

    it('should call fetch with correct URL and headers', async () => {
      const mockResponse = {
        code: 'Ok',
        routes: [
          {
            geometry: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
            distance: 1000,
            duration: 600,
            legs: [
              {
                distance: 1000,
                duration: 600,
                steps: [],
              },
            ],
          },
        ],
        waypoints: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const waypoints: [number, number][] = [
        [19.9385, 50.0647],
        [19.94, 50.065],
      ];
      await osrmService.calculateRoute(waypoints, 'foot');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/route/v1/foot/'),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should return route with decoded coordinates', async () => {
      const mockResponse = {
        code: 'Ok',
        routes: [
          {
            geometry: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
            distance: 1234,
            duration: 567,
            legs: [
              {
                distance: 1234,
                duration: 567,
                steps: [],
              },
            ],
          },
        ],
        waypoints: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const route = await osrmService.calculateRoute(
        [
          [19.9385, 50.0647],
          [19.94, 50.065],
        ],
        'foot'
      );

      expect(route.distance).toBe(1234);
      expect(route.duration).toBe(567);
      expect(route.coordinates).toBeDefined();
      expect(Array.isArray(route.coordinates)).toBe(true);
    });

    it('should throw OsrmError for NoRoute response', async () => {
      const mockResponse = {
        code: 'NoRoute',
        routes: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(
        osrmService.calculateRoute([
          [19.9385, 50.0647],
          [19.94, 50.065],
        ])
      ).rejects.toThrow(OsrmError);
    });

    it('should throw error when server returns non-ok status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        osrmService.calculateRoute([
          [19.9385, 50.0647],
          [19.94, 50.065],
        ])
      ).rejects.toThrow('500');
    });
  });

  describe('reverseGeocode', () => {
    it('should return formatted address from Nominatim response', async () => {
      const mockResponse = {
        address: {
          road: 'Floriańska',
          house_number: '1',
          city: 'Kraków',
        },
        display_name: 'Floriańska 1, Kraków, Polska',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const address = await osrmService.reverseGeocode([19.9385, 50.0647]);

      expect(address).toBe('Floriańska 1, Kraków');
    });

    it('should return coordinates as fallback on error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const address = await osrmService.reverseGeocode([19.9385, 50.0647]);

      expect(address).toContain('50.064700');
      expect(address).toContain('19.938500');
    });

    it('should use display_name when address parts missing', async () => {
      const mockResponse = {
        display_name: 'Some Place, City, Country',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const address = await osrmService.reverseGeocode([19.9385, 50.0647]);

      expect(address).toBe('Some Place, City, Country');
    });
  });
});

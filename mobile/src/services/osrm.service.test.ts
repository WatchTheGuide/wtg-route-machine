import { describe, it, expect, vi, beforeEach } from 'vitest';
import { osrmService } from './osrm.service';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('osrmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    osrmService.setBaseUrl('http://localhost:5001');
  });

  describe('calculateRoute', () => {
    it('should throw error for less than 2 waypoints', async () => {
      await expect(
        osrmService.calculateRoute([[19.9449, 50.0647]], 'foot')
      ).rejects.toThrow('Potrzeba minimum 2 punktów do obliczenia trasy');
    });

    it('should calculate route successfully', async () => {
      const mockResponse = {
        code: 'Ok',
        routes: [
          {
            geometry: {
              coordinates: [
                [19.9449, 50.0647],
                [21.0122, 52.2297],
              ],
            },
            distance: 1000,
            duration: 600,
            legs: [
              {
                steps: [
                  {
                    maneuver: {
                      type: 'depart',
                      location: [19.9449, 50.0647],
                    },
                    distance: 500,
                    duration: 300,
                    name: 'ul. Floriańska',
                  },
                  {
                    maneuver: {
                      type: 'arrive',
                      location: [21.0122, 52.2297],
                    },
                    distance: 0,
                    duration: 0,
                    name: '',
                  },
                ],
              },
            ],
          },
        ],
        waypoints: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const route = await osrmService.calculateRoute(
        [
          [19.9449, 50.0647],
          [21.0122, 52.2297],
        ],
        'foot'
      );

      expect(route.distance).toBe(1000);
      expect(route.duration).toBe(600);
      expect(route.coordinates).toEqual([
        [19.9449, 50.0647],
        [21.0122, 52.2297],
      ]);
      expect(route.steps).toHaveLength(2);
    });

    it('should handle OSRM error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ code: 'NoRoute' }),
      });

      await expect(
        osrmService.calculateRoute(
          [
            [19.9449, 50.0647],
            [21.0122, 52.2297],
          ],
          'foot'
        )
      ).rejects.toThrow('OSRM error: NoRoute');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        osrmService.calculateRoute(
          [
            [19.9449, 50.0647],
            [21.0122, 52.2297],
          ],
          'foot'
        )
      ).rejects.toThrow('Błąd obliczania trasy: Network error');
    });
  });

  describe('findNearest', () => {
    it('should find nearest point', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            code: 'Ok',
            waypoints: [{ location: [19.945, 50.0648] }],
          }),
      });

      const result = await osrmService.findNearest([19.9449, 50.0647], 'foot');

      expect(result).toEqual([19.945, 50.0648]);
    });

    it('should return null on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await osrmService.findNearest([19.9449, 50.0647], 'foot');

      expect(result).toBeNull();
    });
  });
});

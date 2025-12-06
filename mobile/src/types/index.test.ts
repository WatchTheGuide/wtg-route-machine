import { describe, it, expect } from 'vitest';
import {
  CITIES,
  type City,
  type POI,
  type Waypoint,
  type Route,
  type SavedRoute,
} from './index';

describe('types/index', () => {
  describe('CITIES', () => {
    it('should have 4 cities defined', () => {
      expect(Object.keys(CITIES)).toHaveLength(4);
    });

    it('should have all required cities', () => {
      expect(CITIES.krakow).toBeDefined();
      expect(CITIES.warszawa).toBeDefined();
      expect(CITIES.wroclaw).toBeDefined();
      expect(CITIES.trojmiasto).toBeDefined();
    });

    it('should have correct structure for each city', () => {
      Object.values(CITIES).forEach((city: City) => {
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('center');
        expect(city).toHaveProperty('port');
        expect(city.center).toHaveLength(2);
        expect(typeof city.center[0]).toBe('number');
        expect(typeof city.center[1]).toBe('number');
      });
    });

    it('should have Kraków as first city with correct coordinates', () => {
      const krakow = CITIES.krakow;
      expect(krakow.name).toBe('Kraków');
      expect(krakow.center[0]).toBeCloseTo(19.9449, 2); // longitude
      expect(krakow.center[1]).toBeCloseTo(50.0647, 2); // latitude
    });
  });

  describe('Type interfaces', () => {
    it('should allow creating valid POI object', () => {
      const poi: POI = {
        id: 'poi-1',
        name: 'Wawel',
        category: 'landmark',
        coordinate: [19.9354, 50.0543],
        description: 'Zamek królewski',
      };

      expect(poi.id).toBe('poi-1');
      expect(poi.category).toBe('landmark');
    });

    it('should allow creating valid Waypoint object', () => {
      const waypoint: Waypoint = {
        id: 'wp-1',
        coordinate: [19.9354, 50.0543],
        name: 'Start',
      };

      expect(waypoint.id).toBe('wp-1');
      expect(waypoint.coordinate).toHaveLength(2);
    });

    it('should allow creating valid Route object', () => {
      const route: Route = {
        coordinates: [
          [19.9354, 50.0543],
          [19.9449, 50.0647],
        ],
        distance: 1500,
        duration: 1200,
        steps: [],
      };

      expect(route.distance).toBe(1500);
      expect(route.coordinates).toHaveLength(2);
    });

    it('should allow creating valid SavedRoute object', () => {
      const savedRoute: SavedRoute = {
        id: 'route-1',
        name: 'Spacer po Krakowie',
        cityId: 'krakow',
        profile: 'foot',
        waypoints: [],
        route: {
          coordinates: [],
          distance: 0,
          duration: 0,
          steps: [],
        },
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(savedRoute.name).toBe('Spacer po Krakowie');
      expect(savedRoute.profile).toBe('foot');
    });
  });
});

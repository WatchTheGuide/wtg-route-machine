/**
 * useCity Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCity } from './useCity';
import { CITIES, DEFAULT_CITY } from '../types/route.types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCity', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return default city when no saved city', () => {
      const { result } = renderHook(() => useCity());

      expect(result.current.city).toEqual(DEFAULT_CITY);
      expect(result.current.city.id).toBe('krakow');
    });

    it('should load saved city from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('warszawa');

      const { result } = renderHook(() => useCity());

      expect(result.current.city.id).toBe('warszawa');
      expect(result.current.city.name).toBe('Warszawa');
    });

    it('should return default city when saved city is invalid', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid-city');

      const { result } = renderHook(() => useCity());

      expect(result.current.city).toEqual(DEFAULT_CITY);
    });
  });

  describe('setCity', () => {
    it('should update city', () => {
      const { result } = renderHook(() => useCity());

      act(() => {
        result.current.setCity('warszawa');
      });

      expect(result.current.city.id).toBe('warszawa');
      expect(result.current.city.name).toBe('Warszawa');
    });

    it('should save city to localStorage', () => {
      const { result } = renderHook(() => useCity());

      act(() => {
        result.current.setCity('wroclaw');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'guidetrackee_selected_city',
        'wroclaw'
      );
    });
  });

  describe('getCityById', () => {
    it('should return city by id', () => {
      const { result } = renderHook(() => useCity());

      const warszawa = result.current.getCityById('warszawa');

      expect(warszawa).not.toBeNull();
      expect(warszawa?.id).toBe('warszawa');
      expect(warszawa?.name).toBe('Warszawa');
    });

    it('should return undefined for invalid id', () => {
      const { result } = renderHook(() => useCity());

      const city = result.current.getCityById('invalid');

      expect(city).toBeUndefined();
    });
  });

  describe('cities', () => {
    it('should return all available cities', () => {
      const { result } = renderHook(() => useCity());

      expect(result.current.cities).toEqual(CITIES);
      expect(result.current.cities.length).toBeGreaterThanOrEqual(4);
    });

    it('should include all expected cities', () => {
      const { result } = renderHook(() => useCity());
      const cityIds = result.current.cities.map((c) => c.id);

      expect(cityIds).toContain('krakow');
      expect(cityIds).toContain('warszawa');
      expect(cityIds).toContain('wroclaw');
      expect(cityIds).toContain('trojmiasto');
    });
  });

  describe('city properties', () => {
    it('should have bbox property for each city', () => {
      const { result } = renderHook(() => useCity());

      result.current.cities.forEach((city) => {
        expect(city.bbox).toBeDefined();
        expect(city.bbox).toHaveLength(4);
        expect(city.bbox[0]).toBeLessThan(city.bbox[2]); // minLng < maxLng
        expect(city.bbox[1]).toBeLessThan(city.bbox[3]); // minLat < maxLat
      });
    });

    it('should have region property for each city', () => {
      const { result } = renderHook(() => useCity());

      result.current.cities.forEach((city) => {
        expect(city.region).toBeDefined();
        expect(typeof city.region).toBe('string');
        expect(city.region.length).toBeGreaterThan(0);
      });
    });

    it('should have center property for each city', () => {
      const { result } = renderHook(() => useCity());

      result.current.cities.forEach((city) => {
        expect(city.center).toBeDefined();
        expect(city.center).toHaveLength(2);
        // Center should be within bbox
        expect(city.center[0]).toBeGreaterThanOrEqual(city.bbox[0]);
        expect(city.center[0]).toBeLessThanOrEqual(city.bbox[2]);
        expect(city.center[1]).toBeGreaterThanOrEqual(city.bbox[1]);
        expect(city.center[1]).toBeLessThanOrEqual(city.bbox[3]);
      });
    });
  });
});

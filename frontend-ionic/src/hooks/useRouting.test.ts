/**
 * Tests for useRouting Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouting } from './useRouting';
import { osrmService, OsrmError } from '../services/osrm.service';
import { Waypoint } from '../types/route.types';

// Mock osrmService
vi.mock('../services/osrm.service', () => ({
  osrmService: {
    calculateRoute: vi.fn(),
  },
  OsrmError: class OsrmError extends Error {
    constructor(public code: string, message: string) {
      super(message);
      this.name = 'OsrmError';
    }
  },
}));

describe('useRouting', () => {
  const mockWaypoints: Waypoint[] = [
    { id: '1', coordinate: [19.9385, 50.0647], address: 'Point A' },
    { id: '2', coordinate: [19.94, 50.065], address: 'Point B' },
  ];

  const mockRoute = {
    coordinates: [
      [19.9385, 50.0647],
      [19.94, 50.065],
    ] as [number, number][],
    distance: 500,
    duration: 300,
    instructions: [
      { text: 'Start', distance: 0, maneuverType: 'depart', icon: 'play' },
      { text: 'Arrive', distance: 0, maneuverType: 'arrive', icon: 'flag' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(osrmService.calculateRoute).mockResolvedValue(mockRoute);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should have null route initially', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.route).toBeNull();
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.isLoading).toBe(false);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.error).toBeNull();
    });

    it('should default to foot profile', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.profile).toBe('foot');
    });

    it('should default to Kraków city', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.city.id).toBe('krakow');
    });

    it('should have empty instructions initially', () => {
      const { result } = renderHook(() => useRouting());
      expect(result.current.instructions).toEqual([]);
    });
  });

  describe('calculateRoute', () => {
    it('should set loading state during calculation', async () => {
      // Delay the mock to observe loading state
      vi.mocked(osrmService.calculateRoute).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockRoute), 100))
      );

      const { result } = renderHook(() => useRouting());

      act(() => {
        result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set route on successful calculation', async () => {
      const { result } = renderHook(() => useRouting());

      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.route).toEqual(mockRoute);
      expect(result.current.error).toBeNull();
    });

    it('should set instructions from route', async () => {
      const { result } = renderHook(() => useRouting());

      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.instructions).toHaveLength(2);
    });

    it('should clear route when less than 2 waypoints', async () => {
      const { result } = renderHook(() => useRouting());

      // First set a route
      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.route).not.toBeNull();

      // Then call with single waypoint
      await act(async () => {
        await result.current.calculateRoute([mockWaypoints[0]]);
      });

      expect(result.current.route).toBeNull();
      expect(result.current.instructions).toEqual([]);
    });

    it('should set error on OsrmError', async () => {
      vi.mocked(osrmService.calculateRoute).mockRejectedValue(
        new OsrmError('NoRoute', 'No route found')
      );

      const { result } = renderHook(() => useRouting());

      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.error).toBe('No route found');
      expect(result.current.route).toBeNull();
    });

    it('should set generic error on network failure', async () => {
      vi.mocked(osrmService.calculateRoute).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useRouting());

      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.error).toContain('połączyć');
      expect(result.current.route).toBeNull();
    });

    it('should use current profile for calculation', async () => {
      const { result } = renderHook(() => useRouting());

      act(() => {
        result.current.setProfile('bicycle');
      });

      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(osrmService.calculateRoute).toHaveBeenCalledWith(
        expect.any(Array),
        'bicycle'
      );
    });
  });

  describe('clearRoute', () => {
    it('should clear route and error', async () => {
      const { result } = renderHook(() => useRouting());

      // Set a route first
      await act(async () => {
        await result.current.calculateRoute(mockWaypoints);
      });

      expect(result.current.route).not.toBeNull();

      // Clear it
      act(() => {
        result.current.clearRoute();
      });

      expect(result.current.route).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.instructions).toEqual([]);
    });
  });

  describe('setProfile', () => {
    it('should update profile', () => {
      const { result } = renderHook(() => useRouting());

      act(() => {
        result.current.setProfile('bicycle');
      });

      expect(result.current.profile).toBe('bicycle');
    });

    it('should accept all valid profiles', () => {
      const { result } = renderHook(() => useRouting());

      act(() => {
        result.current.setProfile('car');
      });
      expect(result.current.profile).toBe('car');

      act(() => {
        result.current.setProfile('foot');
      });
      expect(result.current.profile).toBe('foot');
    });
  });

  describe('setCity', () => {
    it('should update city', () => {
      const { result } = renderHook(() => useRouting());
      const newCity = {
        id: 'warszawa',
        name: 'Warszawa',
        center: [21.0122, 52.2297] as [number, number],
        zoom: 12,
      };

      act(() => {
        result.current.setCity(newCity);
      });

      expect(result.current.city.id).toBe('warszawa');
    });
  });
});

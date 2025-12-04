/**
 * Tests for useWaypoints Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWaypoints } from './useWaypoints';
import { osrmService } from '../services/osrm.service';

// Mock osrmService
vi.mock('../services/osrm.service', () => ({
  osrmService: {
    reverseGeocode: vi.fn(),
  },
}));

describe('useWaypoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(osrmService.reverseGeocode).mockResolvedValue('Test Address');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty waypoints array', () => {
      const { result } = renderHook(() => useWaypoints());
      expect(result.current.waypoints).toEqual([]);
    });
  });

  describe('addWaypoint', () => {
    it('should add a waypoint with coordinate', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
      });

      expect(result.current.waypoints).toHaveLength(1);
      expect(result.current.waypoints[0].coordinate).toEqual([
        19.9385, 50.0647,
      ]);
    });

    it('should generate unique IDs for each waypoint', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
        await result.current.addWaypoint([19.94, 50.065]);
      });

      expect(result.current.waypoints).toHaveLength(2);
      expect(result.current.waypoints[0].id).not.toBe(
        result.current.waypoints[1].id
      );
    });

    it('should fetch address via reverse geocoding', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
      });

      await waitFor(() => {
        expect(result.current.waypoints[0].address).toBe('Test Address');
      });

      expect(osrmService.reverseGeocode).toHaveBeenCalledWith([
        19.9385, 50.0647,
      ]);
    });

    it('should use coordinates as fallback if geocoding fails', async () => {
      vi.mocked(osrmService.reverseGeocode).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
      });

      // Address should contain the coordinates as fallback
      expect(result.current.waypoints[0].address).toContain('50.064700');
    });
  });

  describe('removeWaypoint', () => {
    it('should remove waypoint by ID', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
        await result.current.addWaypoint([19.94, 50.065]);
      });

      const idToRemove = result.current.waypoints[0].id;

      act(() => {
        result.current.removeWaypoint(idToRemove);
      });

      expect(result.current.waypoints).toHaveLength(1);
      expect(result.current.waypoints[0].id).not.toBe(idToRemove);
    });

    it('should do nothing if ID does not exist', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
      });

      act(() => {
        result.current.removeWaypoint('non-existent-id');
      });

      expect(result.current.waypoints).toHaveLength(1);
    });
  });

  describe('reorderWaypoints', () => {
    it('should reorder waypoints correctly', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
        await result.current.addWaypoint([19.94, 50.065]);
        await result.current.addWaypoint([19.942, 50.066]);
      });

      const originalFirst = result.current.waypoints[0];
      const originalSecond = result.current.waypoints[1];

      act(() => {
        result.current.reorderWaypoints(0, 1);
      });

      expect(result.current.waypoints[0].id).toBe(originalSecond.id);
      expect(result.current.waypoints[1].id).toBe(originalFirst.id);
    });
  });

  describe('clearWaypoints', () => {
    it('should clear all waypoints', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
        await result.current.addWaypoint([19.94, 50.065]);
      });

      expect(result.current.waypoints).toHaveLength(2);

      act(() => {
        result.current.clearWaypoints();
      });

      expect(result.current.waypoints).toEqual([]);
    });
  });

  describe('updateWaypointAddress', () => {
    it('should update waypoint address', async () => {
      const { result } = renderHook(() => useWaypoints());

      await act(async () => {
        await result.current.addWaypoint([19.9385, 50.0647]);
      });

      const id = result.current.waypoints[0].id;

      act(() => {
        result.current.updateWaypointAddress(id, 'New Address');
      });

      expect(result.current.waypoints[0].address).toBe('New Address');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  useRoutePlannerStore,
  selectCanCalculateRoute,
  selectWaypointCount,
} from './routePlannerStore';

describe('routePlannerStore', () => {
  beforeEach(() => {
    // Reset store przed każdym testem
    act(() => {
      useRoutePlannerStore.getState().reset();
    });
  });

  describe('waypoints', () => {
    it('powinien dodawać waypoint', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9449, 50.0647], 'Test Point');
      });

      expect(result.current.waypoints).toHaveLength(1);
      expect(result.current.waypoints[0].name).toBe('Test Point');
      expect(result.current.waypoints[0].coordinate).toEqual([
        19.9449, 50.0647,
      ]);
    });

    it('powinien usuwać waypoint', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9449, 50.0647], 'Point 1');
        result.current.addWaypoint([19.95, 50.07], 'Point 2');
      });

      const waypointId = result.current.waypoints[0].id;

      act(() => {
        result.current.removeWaypoint(waypointId);
      });

      expect(result.current.waypoints).toHaveLength(1);
      expect(result.current.waypoints[0].name).toBe('Point 2');
    });

    it('powinien zmieniać kolejność waypoints', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9, 50.0], 'A');
        result.current.addWaypoint([19.91, 50.01], 'B');
        result.current.addWaypoint([19.92, 50.02], 'C');
      });

      act(() => {
        result.current.reorderWaypoints(0, 2); // Przesuń A na koniec
      });

      expect(result.current.waypoints[0].name).toBe('B');
      expect(result.current.waypoints[1].name).toBe('C');
      expect(result.current.waypoints[2].name).toBe('A');
    });

    it('powinien aktualizować waypoint', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9449, 50.0647], 'Old Name');
      });

      const waypointId = result.current.waypoints[0].id;

      act(() => {
        result.current.updateWaypoint(waypointId, { name: 'New Name' });
      });

      expect(result.current.waypoints[0].name).toBe('New Name');
    });

    it('powinien czyścić waypoints', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9, 50.0], 'A');
        result.current.addWaypoint([19.91, 50.01], 'B');
      });

      act(() => {
        result.current.clearWaypoints();
      });

      expect(result.current.waypoints).toHaveLength(0);
    });
  });

  describe('route', () => {
    it('powinien ustawiać trasę', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      const mockRoute = {
        coordinates: [[19.9, 50.0] as [number, number]],
        distance: 1000,
        duration: 600,
        steps: [],
      };

      act(() => {
        result.current.setRoute(mockRoute);
      });

      expect(result.current.route).toEqual(mockRoute);
    });

    it('powinien czyścić trasę', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.setRoute({
          coordinates: [],
          distance: 0,
          duration: 0,
          steps: [],
        });
      });

      act(() => {
        result.current.clearRoute();
      });

      expect(result.current.route).toBeNull();
    });
  });

  describe('profile', () => {
    it('powinien zmieniać profil', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      expect(result.current.profile).toBe('foot');

      act(() => {
        result.current.setProfile('bicycle');
      });

      expect(result.current.profile).toBe('bicycle');
    });
  });

  describe('planner state', () => {
    it('powinien otwierać i zamykać planer', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      expect(result.current.isPlannerOpen).toBe(false);

      act(() => {
        result.current.openPlanner();
      });

      expect(result.current.isPlannerOpen).toBe(true);

      act(() => {
        result.current.closePlanner();
      });

      expect(result.current.isPlannerOpen).toBe(false);
    });

    it('powinien resetować cały stan', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      act(() => {
        result.current.addWaypoint([19.9, 50.0], 'Test');
        result.current.setProfile('bicycle');
        result.current.openPlanner();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.waypoints).toHaveLength(0);
      expect(result.current.profile).toBe('foot');
      expect(result.current.isPlannerOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    it('selectCanCalculateRoute powinien zwracać true dla >= 2 waypoints', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      expect(selectCanCalculateRoute(result.current)).toBe(false);

      act(() => {
        result.current.addWaypoint([19.9, 50.0], 'A');
      });

      expect(selectCanCalculateRoute(result.current)).toBe(false);

      act(() => {
        result.current.addWaypoint([19.91, 50.01], 'B');
      });

      expect(selectCanCalculateRoute(result.current)).toBe(true);
    });

    it('selectWaypointCount powinien zwracać liczbę waypoints', () => {
      const { result } = renderHook(() => useRoutePlannerStore());

      expect(selectWaypointCount(result.current)).toBe(0);

      act(() => {
        result.current.addWaypoint([19.9, 50.0], 'A');
        result.current.addWaypoint([19.91, 50.01], 'B');
      });

      expect(selectWaypointCount(result.current)).toBe(2);
    });
  });
});

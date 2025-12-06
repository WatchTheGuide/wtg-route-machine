import { useCallback } from 'react';
import {
  useRoutePlannerStore,
  selectCanCalculateRoute,
} from '../stores/routePlannerStore';
import { Coordinate, Waypoint } from '../types';

interface UseWaypointsReturn {
  /** Lista waypoints */
  waypoints: Waypoint[];
  /** Dodaj waypoint */
  addWaypoint: (coordinate: Coordinate, name?: string) => void;
  /** Usuń waypoint */
  removeWaypoint: (id: string) => void;
  /** Zmień kolejność waypoints */
  reorderWaypoints: (fromIndex: number, toIndex: number) => void;
  /** Aktualizuj waypoint */
  updateWaypoint: (id: string, updates: Partial<Omit<Waypoint, 'id'>>) => void;
  /** Wyczyść wszystkie waypoints */
  clearWaypoints: () => void;
  /** Czy mamy wystarczająco waypoints do trasy (min 2) */
  canCalculateRoute: boolean;
}

/**
 * Hook do zarządzania waypoints trasy
 * Wrapper na globalny routePlannerStore dla kompatybilności wstecznej
 */
export const useWaypoints = (): UseWaypointsReturn => {
  const waypoints = useRoutePlannerStore((state) => state.waypoints);
  const canCalculateRoute = useRoutePlannerStore(selectCanCalculateRoute);

  const storeAddWaypoint = useRoutePlannerStore((state) => state.addWaypoint);
  const storeRemoveWaypoint = useRoutePlannerStore(
    (state) => state.removeWaypoint
  );
  const storeReorderWaypoints = useRoutePlannerStore(
    (state) => state.reorderWaypoints
  );
  const storeUpdateWaypoint = useRoutePlannerStore(
    (state) => state.updateWaypoint
  );
  const storeClearWaypoints = useRoutePlannerStore(
    (state) => state.clearWaypoints
  );

  const addWaypoint = useCallback(
    (coordinate: Coordinate, name?: string) => {
      storeAddWaypoint(coordinate, name);
    },
    [storeAddWaypoint]
  );

  const removeWaypoint = useCallback(
    (id: string) => {
      storeRemoveWaypoint(id);
    },
    [storeRemoveWaypoint]
  );

  const reorderWaypoints = useCallback(
    (fromIndex: number, toIndex: number) => {
      storeReorderWaypoints(fromIndex, toIndex);
    },
    [storeReorderWaypoints]
  );

  const updateWaypoint = useCallback(
    (id: string, updates: Partial<Omit<Waypoint, 'id'>>) => {
      storeUpdateWaypoint(id, updates);
    },
    [storeUpdateWaypoint]
  );

  const clearWaypoints = useCallback(() => {
    storeClearWaypoints();
  }, [storeClearWaypoints]);

  return {
    waypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    updateWaypoint,
    clearWaypoints,
    canCalculateRoute,
  };
};

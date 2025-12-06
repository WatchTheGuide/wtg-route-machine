import { useCallback, useState } from 'react';
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
 * Generuje unikalne ID dla waypointa
 */
const generateId = (): string => {
  return `wp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Hook do zarządzania waypoints trasy
 */
export const useWaypoints = (): UseWaypointsReturn => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const addWaypoint = useCallback((coordinate: Coordinate, name?: string) => {
    setWaypoints((prev) => {
      const newWaypoint: Waypoint = {
        id: generateId(),
        coordinate,
        name: name || `Punkt ${prev.length + 1}`,
      };
      return [...prev, newWaypoint];
    });
  }, []);

  const removeWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  const reorderWaypoints = useCallback((fromIndex: number, toIndex: number) => {
    setWaypoints((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  const updateWaypoint = useCallback(
    (id: string, updates: Partial<Omit<Waypoint, 'id'>>) => {
      setWaypoints((prev) =>
        prev.map((wp) => (wp.id === id ? { ...wp, ...updates } : wp))
      );
    },
    []
  );

  const clearWaypoints = useCallback(() => {
    setWaypoints([]);
  }, []);

  return {
    waypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    updateWaypoint,
    clearWaypoints,
    canCalculateRoute: waypoints.length >= 2,
  };
};

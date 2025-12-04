/**
 * useWaypoints Hook
 * Manages waypoint state with add, remove, reorder, and clear operations
 */

import { useState, useCallback } from 'react';
import { Waypoint, Coordinate } from '../types/route.types';
import { osrmService } from '../services/osrm.service';

export interface UseWaypointsReturn {
  waypoints: Waypoint[];
  addWaypoint: (coordinate: Coordinate) => Promise<void>;
  removeWaypoint: (id: string) => void;
  reorderWaypoints: (fromIndex: number, toIndex: number) => void;
  clearWaypoints: () => void;
  updateWaypointAddress: (id: string, address: string) => void;
}

/**
 * Generate unique ID for waypoints
 */
function generateId(): string {
  return `wp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Custom hook for managing waypoints
 */
export function useWaypoints(): UseWaypointsReturn {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  /**
   * Add a new waypoint with reverse geocoding for address
   */
  const addWaypoint = useCallback(
    async (coordinate: Coordinate): Promise<void> => {
      const id = generateId();

      // Add waypoint immediately with coordinate as placeholder address
      const newWaypoint: Waypoint = {
        id,
        coordinate,
        address: `${coordinate[1].toFixed(6)}, ${coordinate[0].toFixed(6)}`,
      };

      setWaypoints((prev) => [...prev, newWaypoint]);

      // Fetch address asynchronously
      try {
        const address = await osrmService.reverseGeocode(coordinate);
        setWaypoints((prev) =>
          prev.map((wp) => (wp.id === id ? { ...wp, address } : wp))
        );
      } catch (error) {
        console.error('Failed to geocode waypoint:', error);
      }
    },
    []
  );

  /**
   * Remove a waypoint by ID
   */
  const removeWaypoint = useCallback((id: string): void => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  /**
   * Reorder waypoints (drag and drop)
   */
  const reorderWaypoints = useCallback(
    (fromIndex: number, toIndex: number): void => {
      setWaypoints((prev) => {
        const result = [...prev];
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        return result;
      });
    },
    []
  );

  /**
   * Clear all waypoints
   */
  const clearWaypoints = useCallback((): void => {
    setWaypoints([]);
  }, []);

  /**
   * Update waypoint address manually
   */
  const updateWaypointAddress = useCallback(
    (id: string, address: string): void => {
      setWaypoints((prev) =>
        prev.map((wp) => (wp.id === id ? { ...wp, address } : wp))
      );
    },
    []
  );

  return {
    waypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    clearWaypoints,
    updateWaypointAddress,
  };
}

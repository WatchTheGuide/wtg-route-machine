/**
 * useWaypoints - Hook for managing route waypoints
 */

import { useCallback } from 'react';
import { create } from 'zustand';
import { Coordinate, Waypoint, POI } from '../types';

interface WaypointsState {
  waypoints: Waypoint[];
  addWaypoint: (coordinate: Coordinate, name?: string, poi?: POI) => void;
  removeWaypoint: (id: string) => void;
  reorderWaypoints: (fromIndex: number, toIndex: number) => void;
  clearWaypoints: () => void;
  updateWaypoint: (id: string, updates: Partial<Waypoint>) => void;
}

export const useWaypointsStore = create<WaypointsState>((set) => ({
  waypoints: [],

  addWaypoint: (coordinate, name, poi) =>
    set((state) => {
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        coordinate,
        name: name || poi?.name || `Punkt ${state.waypoints.length + 1}`,
        poi,
        order: state.waypoints.length,
      };
      return { waypoints: [...state.waypoints, newWaypoint] };
    }),

  removeWaypoint: (id) =>
    set((state) => ({
      waypoints: state.waypoints
        .filter((wp) => wp.id !== id)
        .map((wp, index) => ({ ...wp, order: index })),
    })),

  reorderWaypoints: (fromIndex, toIndex) =>
    set((state) => {
      const waypoints = [...state.waypoints];
      const [removed] = waypoints.splice(fromIndex, 1);
      waypoints.splice(toIndex, 0, removed);
      return {
        waypoints: waypoints.map((wp, index) => ({ ...wp, order: index })),
      };
    }),

  clearWaypoints: () => set({ waypoints: [] }),

  updateWaypoint: (id, updates) =>
    set((state) => ({
      waypoints: state.waypoints.map((wp) =>
        wp.id === id ? { ...wp, ...updates } : wp
      ),
    })),
}));

/**
 * Hook wrapper for waypoints store with additional utilities
 */
export function useWaypoints() {
  const store = useWaypointsStore();

  const addFromPOI = useCallback(
    (poi: POI) => {
      store.addWaypoint(poi.coordinate, poi.name, poi);
    },
    [store]
  );

  const addFromMapPress = useCallback(
    (coordinate: Coordinate) => {
      store.addWaypoint(coordinate);
    },
    [store]
  );

  const canCalculateRoute = store.waypoints.length >= 2;

  return {
    ...store,
    addFromPOI,
    addFromMapPress,
    canCalculateRoute,
  };
}

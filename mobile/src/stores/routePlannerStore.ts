import { create } from 'zustand';
import { Coordinate, Waypoint, Route, RoutingProfile } from '../types';

/**
 * Generuje unikalne ID dla waypointa
 */
const generateId = (): string => {
  return `wp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface RoutePlannerState {
  /** Lista waypoints trasy */
  waypoints: Waypoint[];
  /** Obliczona trasa */
  route: Route | null;
  /** Profil trasowania */
  profile: RoutingProfile;
  /** Czy planer jest aktywny (otwarty) */
  isPlannerOpen: boolean;
  /** Czy trwają obliczenia trasy */
  isCalculating: boolean;
  /** Błąd obliczania trasy */
  error: string | null;

  // Akcje waypoints
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

  // Akcje trasy
  /** Ustaw obliczoną trasę */
  setRoute: (route: Route | null) => void;
  /** Ustaw profil trasowania */
  setProfile: (profile: RoutingProfile) => void;
  /** Ustaw stan obliczeń */
  setCalculating: (isCalculating: boolean) => void;
  /** Ustaw błąd */
  setError: (error: string | null) => void;
  /** Wyczyść trasę */
  clearRoute: () => void;

  // Akcje planera
  /** Otwórz planer */
  openPlanner: () => void;
  /** Zamknij planer */
  closePlanner: () => void;
  /** Resetuj cały stan */
  reset: () => void;
}

const initialState = {
  waypoints: [] as Waypoint[],
  route: null as Route | null,
  profile: 'foot' as RoutingProfile,
  isPlannerOpen: false,
  isCalculating: false,
  error: null as string | null,
};

export const useRoutePlannerStore = create<RoutePlannerState>()((set) => ({
  ...initialState,

  // Waypoints actions
  addWaypoint: (coordinate: Coordinate, name?: string) => {
    set((state) => {
      const newWaypoint: Waypoint = {
        id: generateId(),
        coordinate,
        name: name || `Punkt ${state.waypoints.length + 1}`,
      };
      return { waypoints: [...state.waypoints, newWaypoint] };
    });
  },

  removeWaypoint: (id: string) => {
    set((state) => ({
      waypoints: state.waypoints.filter((wp) => wp.id !== id),
    }));
  },

  reorderWaypoints: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const result = [...state.waypoints];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return { waypoints: result };
    });
  },

  updateWaypoint: (id: string, updates: Partial<Omit<Waypoint, 'id'>>) => {
    set((state) => ({
      waypoints: state.waypoints.map((wp) =>
        wp.id === id ? { ...wp, ...updates } : wp
      ),
    }));
  },

  clearWaypoints: () => {
    set({ waypoints: [], route: null, error: null });
  },

  // Route actions
  setRoute: (route: Route | null) => {
    set({ route, error: null });
  },

  setProfile: (profile: RoutingProfile) => {
    set({ profile });
  },

  setCalculating: (isCalculating: boolean) => {
    set({ isCalculating });
  },

  setError: (error: string | null) => {
    set({ error, isCalculating: false });
  },

  clearRoute: () => {
    set({ route: null, error: null });
  },

  // Planner actions
  openPlanner: () => {
    set({ isPlannerOpen: true });
  },

  closePlanner: () => {
    set({ isPlannerOpen: false });
  },

  reset: () => {
    set(initialState);
  },
}));

// Selektory pomocnicze
export const selectCanCalculateRoute = (state: RoutePlannerState): boolean =>
  state.waypoints.length >= 2;

export const selectWaypointCount = (state: RoutePlannerState): number =>
  state.waypoints.length;

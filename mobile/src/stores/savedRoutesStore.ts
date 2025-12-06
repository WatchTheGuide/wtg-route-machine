import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';
import { SavedRoute, Waypoint, Route, RoutingProfile } from '../types';

/**
 * Custom storage adapter for Capacitor Preferences
 */
const capacitorStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name });
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name });
  },
};

interface SavedRoutesState {
  /** Lista zapisanych tras */
  routes: SavedRoute[];

  /** Zapisz nową trasę */
  saveRoute: (params: {
    name: string;
    description?: string;
    cityId: string;
    profile: RoutingProfile;
    waypoints: Waypoint[];
    route: Route;
  }) => SavedRoute;

  /** Aktualizuj trasę */
  updateRoute: (
    id: string,
    updates: Partial<Pick<SavedRoute, 'name' | 'description' | 'isFavorite'>>
  ) => void;

  /** Usuń trasę */
  deleteRoute: (id: string) => void;

  /** Przełącz ulubione */
  toggleFavorite: (id: string) => void;

  /** Pobierz trasę po ID */
  getRouteById: (id: string) => SavedRoute | undefined;

  /** Pobierz trasy dla miasta */
  getRoutesByCity: (cityId: string) => SavedRoute[];

  /** Pobierz ulubione trasy */
  getFavoriteRoutes: () => SavedRoute[];
}

/**
 * Generuje unikalny ID dla trasy
 */
const generateRouteId = (): string => {
  return `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Store dla zapisanych tras z persystencją w Capacitor Preferences
 */
export const useSavedRoutesStore = create<SavedRoutesState>()(
  persist(
    (set, get) => ({
      routes: [],

      saveRoute: ({ name, description, cityId, profile, waypoints, route }) => {
        const now = new Date().toISOString();
        const newRoute: SavedRoute = {
          id: generateRouteId(),
          name,
          description,
          cityId,
          profile,
          waypoints,
          route,
          isFavorite: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          routes: [newRoute, ...state.routes],
        }));

        return newRoute;
      },

      updateRoute: (id, updates) => {
        set((state) => ({
          routes: state.routes.map((route) =>
            route.id === id
              ? { ...route, ...updates, updatedAt: new Date().toISOString() }
              : route
          ),
        }));
      },

      deleteRoute: (id) => {
        set((state) => ({
          routes: state.routes.filter((route) => route.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          routes: state.routes.map((route) =>
            route.id === id
              ? {
                  ...route,
                  isFavorite: !route.isFavorite,
                  updatedAt: new Date().toISOString(),
                }
              : route
          ),
        }));
      },

      getRouteById: (id) => {
        return get().routes.find((route) => route.id === id);
      },

      getRoutesByCity: (cityId) => {
        return get().routes.filter((route) => route.cityId === cityId);
      },

      getFavoriteRoutes: () => {
        return get().routes.filter((route) => route.isFavorite);
      },
    }),
    {
      name: 'wtg-saved-routes',
      storage: createJSONStorage(() => capacitorStorage),
    }
  )
);

/**
 * Selektory dla optymalizacji re-renderów
 */
export const selectRoutes = (state: SavedRoutesState) => state.routes;
export const selectRouteCount = (state: SavedRoutesState) =>
  state.routes.length;
export const selectFavoriteCount = (state: SavedRoutesState) =>
  state.routes.filter((r) => r.isFavorite).length;

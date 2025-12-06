/**
 * useRouteStore - Store for saved routes with AsyncStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Route } from '../types';

interface RouteStoreState {
  savedRoutes: Route[];
  saveRoute: (route: Route) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getRouteById: (id: string) => Route | undefined;
  getFavoriteRoutes: () => Route[];
}

export const useRouteStore = create<RouteStoreState>()(
  persist(
    (set, get) => ({
      savedRoutes: [],

      saveRoute: (route) =>
        set((state) => ({
          savedRoutes: [
            {
              ...route,
              id: `saved-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.savedRoutes,
          ],
        })),

      updateRoute: (id, updates) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.map((route) =>
            route.id === id
              ? { ...route, ...updates, updatedAt: new Date().toISOString() }
              : route
          ),
        })),

      deleteRoute: (id) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.filter((route) => route.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.map((route) =>
            route.id === id
              ? { ...route, isFavorite: !route.isFavorite }
              : route
          ),
        })),

      getRouteById: (id) => get().savedRoutes.find((route) => route.id === id),

      getFavoriteRoutes: () =>
        get().savedRoutes.filter((route) => route.isFavorite),
    }),
    {
      name: 'wtg-saved-routes',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

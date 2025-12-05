/**
 * WTG Routes - Routes Hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SavedRoute, Waypoint, RoutingProfile } from '../types';

// Temporary mock data - will be replaced with Supabase
const mockRoutes: SavedRoute[] = [];

export function useSavedRoutes() {
  return useQuery({
    queryKey: ['saved-routes'],
    queryFn: async (): Promise<SavedRoute[]> => {
      // TODO: Replace with Supabase query
      return mockRoutes;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoute(routeId: string) {
  return useQuery({
    queryKey: ['route', routeId],
    queryFn: async (): Promise<SavedRoute | null> => {
      // TODO: Replace with Supabase query
      return mockRoutes.find((r) => r.id === routeId) || null;
    },
    enabled: !!routeId,
  });
}

export function useSaveRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      route: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<SavedRoute> => {
      // TODO: Replace with Supabase insert
      const newRoute: SavedRoute = {
        ...route,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRoutes.push(newRoute);
      return newRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-routes'] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string): Promise<void> => {
      // TODO: Replace with Supabase delete
      const index = mockRoutes.findIndex((r) => r.id === routeId);
      if (index > -1) {
        mockRoutes.splice(index, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-routes'] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string): Promise<void> => {
      // TODO: Replace with Supabase update
      const route = mockRoutes.find((r) => r.id === routeId);
      if (route) {
        route.isFavorite = !route.isFavorite;
        route.updatedAt = new Date().toISOString();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-routes'] });
    },
  });
}

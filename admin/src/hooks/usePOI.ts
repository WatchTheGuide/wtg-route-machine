/**
 * usePOI hook - TanStack Query hooks for POI operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import poiService, {
  type CityPOI,
  type CityInfo,
  type CategoryInfo,
  type POICategory,
  type AdminPOI,
  type AdminPOIListResponse,
  type AdminPOIStatsResponse,
  type AdminPOIFilters,
} from '@/services/poi.service';

// Query keys
export const poiKeys = {
  all: ['poi'] as const,
  cities: () => [...poiKeys.all, 'cities'] as const,
  categories: () => [...poiKeys.all, 'categories'] as const,
  city: (cityId: string) => [...poiKeys.all, 'city', cityId] as const,
  cityWithFilters: (cityId: string, categories?: POICategory[]) =>
    [...poiKeys.city(cityId), { categories }] as const,
  search: (cityId: string, query: string) =>
    [...poiKeys.all, 'search', cityId, query] as const,
  nearby: (cityId: string, lon: number, lat: number, radius: number) =>
    [...poiKeys.all, 'nearby', cityId, lon, lat, radius] as const,
  detail: (cityId: string, poiId: string) =>
    [...poiKeys.all, 'detail', cityId, poiId] as const,
  // Admin keys
  admin: () => [...poiKeys.all, 'admin'] as const,
  adminList: (filters?: AdminPOIFilters) =>
    [...poiKeys.admin(), 'list', filters] as const,
  adminStats: () => [...poiKeys.admin(), 'stats'] as const,
};

/**
 * Hook to get cities with POI counts
 */
export function usePOICities() {
  return useQuery<CityInfo[], Error>({
    queryKey: poiKeys.cities(),
    queryFn: () => poiService.getCities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get POI categories
 */
export function usePOICategories() {
  return useQuery<CategoryInfo[], Error>({
    queryKey: poiKeys.categories(),
    queryFn: () => poiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get POIs for a city
 */
export function useCityPOIs(
  cityId: string,
  options?: {
    categories?: POICategory[];
    enabled?: boolean;
  }
) {
  const { categories, enabled = true } = options || {};

  return useQuery<CityPOI[], Error>({
    queryKey: poiKeys.cityWithFilters(cityId, categories),
    queryFn: () => poiService.getPOIsForCity(cityId, categories),
    enabled: enabled && Boolean(cityId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to search POIs
 */
export function useSearchPOIs(
  cityId: string,
  query: string,
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};

  return useQuery<CityPOI[], Error>({
    queryKey: poiKeys.search(cityId, query),
    queryFn: () => poiService.searchPOIs(cityId, query),
    enabled: enabled && Boolean(cityId) && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get nearby POIs
 */
export function useNearbyPOIs(
  cityId: string,
  lon: number,
  lat: number,
  radius: number = 500,
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};

  return useQuery<(CityPOI & { distance: number })[], Error>({
    queryKey: poiKeys.nearby(cityId, lon, lat, radius),
    queryFn: () => poiService.getNearbyPOIs(cityId, lon, lat, radius),
    enabled: enabled && Boolean(cityId) && lon !== 0 && lat !== 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get single POI details
 */
export function usePOIDetail(
  cityId: string,
  poiId: string,
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};

  return useQuery<CityPOI, Error>({
    queryKey: poiKeys.detail(cityId, poiId),
    queryFn: () => poiService.getPOI(cityId, poiId),
    enabled: enabled && Boolean(cityId) && Boolean(poiId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// MUTATION HOOKS (CRUD)
// ============================================

/**
 * Hook to create a new POI
 */
export function useCreatePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cityId,
      poi,
    }: {
      cityId: string;
      poi: Omit<CityPOI, 'id'>;
    }) => poiService.createPOI(cityId, poi),
    onSuccess: (_data, variables) => {
      // Invalidate city POIs to refetch
      queryClient.invalidateQueries({
        queryKey: poiKeys.city(variables.cityId),
      });
      // Invalidate cities list (POI count changed)
      queryClient.invalidateQueries({
        queryKey: poiKeys.cities(),
      });
    },
  });
}

/**
 * Hook to update an existing POI
 */
export function useUpdatePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cityId,
      poiId,
      updates,
    }: {
      cityId: string;
      poiId: string;
      updates: Partial<CityPOI>;
    }) => poiService.updatePOI(cityId, poiId, updates),
    onSuccess: (data, variables) => {
      // Update the POI in the cache
      queryClient.setQueryData(
        poiKeys.detail(variables.cityId, variables.poiId),
        data
      );
      // Invalidate city POIs to refetch
      queryClient.invalidateQueries({
        queryKey: poiKeys.city(variables.cityId),
      });
    },
  });
}

/**
 * Hook to delete a POI
 */
export function useDeletePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cityId, poiId }: { cityId: string; poiId: string }) =>
      poiService.deletePOI(cityId, poiId),
    onSuccess: (_data, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: poiKeys.detail(variables.cityId, variables.poiId),
      });
      // Invalidate city POIs
      queryClient.invalidateQueries({
        queryKey: poiKeys.city(variables.cityId),
      });
      // Invalidate cities list (POI count changed)
      queryClient.invalidateQueries({
        queryKey: poiKeys.cities(),
      });
      // Invalidate admin list
      queryClient.invalidateQueries({
        queryKey: poiKeys.admin(),
      });
    },
  });
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to get all POIs with filters (admin)
 */
export function useAdminPOIs(filters?: AdminPOIFilters) {
  return useQuery<AdminPOIListResponse, Error>({
    queryKey: poiKeys.adminList(filters),
    queryFn: () => poiService.getAllPOIs(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get POI statistics (admin)
 */
export function useAdminPOIStats() {
  return useQuery<AdminPOIStatsResponse, Error>({
    queryKey: poiKeys.adminStats(),
    queryFn: () => poiService.getPOIStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to bulk delete POIs (admin)
 */
export function useBulkDeletePOIs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { cityId: string; poiId: string }[]) =>
      poiService.bulkDeletePOIs(items),
    onSuccess: () => {
      // Invalidate all POI-related queries
      queryClient.invalidateQueries({
        queryKey: poiKeys.all,
      });
    },
  });
}

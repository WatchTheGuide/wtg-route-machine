/**
 * usePOI hook - TanStack Query hooks for POI operations
 */

import { useQuery } from '@tanstack/react-query';
import poiService, {
  type CityPOI,
  type CityInfo,
  type CategoryInfo,
  type POICategory,
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

/**
 * WTG Routes - POI Hook
 */

import { useQuery } from '@tanstack/react-query';
import { poiService } from '../services/poi.service';
import type { POI, POICategory } from '../types';

export function usePOIs(cityId: string, category?: string) {
  return useQuery({
    queryKey: ['pois', cityId, category],
    queryFn: () => poiService.getPOIs(cityId, category),
    enabled: !!cityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePOISearch(cityId: string, query: string) {
  return useQuery({
    queryKey: ['pois', 'search', cityId, query],
    queryFn: () => poiService.searchPOIs(cityId, query),
    enabled: !!cityId && query.length >= 2,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useNearbyPOIs(
  cityId: string,
  lat: number,
  lon: number,
  radius?: number
) {
  return useQuery({
    queryKey: ['pois', 'near', cityId, lat, lon, radius],
    queryFn: () => poiService.getNearbyPOIs(cityId, lat, lon, radius),
    enabled: !!cityId && !!lat && !!lon,
    staleTime: 60 * 1000,
  });
}

export function usePOICategories() {
  return useQuery({
    queryKey: ['poi-categories'],
    queryFn: () => poiService.getCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => poiService.getCities(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * usePOI - Hook for fetching POIs with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { poiService } from '../services/poi.service';
import { POI, POICategory } from '../types';

export function usePOIs(cityId: string) {
  return useQuery({
    queryKey: ['pois', cityId],
    queryFn: () => poiService.getPOIs(cityId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePOIsByCategory(cityId: string, category: POICategory) {
  return useQuery({
    queryKey: ['pois', cityId, category],
    queryFn: () => poiService.getPOIsByCategory(cityId, category),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchPOIs(cityId: string, query: string) {
  return useQuery({
    queryKey: ['pois', 'search', cityId, query],
    queryFn: () => poiService.searchPOIs(cityId, query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}

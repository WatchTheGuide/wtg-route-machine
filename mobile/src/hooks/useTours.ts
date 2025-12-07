import { useQuery } from '@tanstack/react-query';
import type { Tour } from '../types';
import { toursService } from '../services/tours.service';

/**
 * Hook for fetching tours by city
 */
export function useTours(cityId: string) {
  return useQuery<Tour[], Error>({
    queryKey: ['tours', cityId],
    queryFn: () => toursService.getToursByCity(cityId),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for fetching a single tour by ID
 * @param cityId - City ID where the tour is located
 * @param tourId - Unique tour identifier
 */
export function useTour(cityId: string, tourId: string) {
  return useQuery<Tour | undefined, Error>({
    queryKey: ['tour', cityId, tourId],
    queryFn: () => toursService.getTourById(cityId, tourId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!cityId && !!tourId, // Only fetch if both IDs are provided
  });
}

/**
 * Hook for fetching all tours
 */
export function useAllTours() {
  return useQuery<Tour[], Error>({
    queryKey: ['tours', 'all'],
    queryFn: () => toursService.getAllTours(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

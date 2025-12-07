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
 */
export function useTour(tourId: string) {
  return useQuery<Tour | undefined, Error>({
    queryKey: ['tour', tourId],
    queryFn: () => toursService.getTourById(tourId),
    staleTime: 1000 * 60 * 10, // 10 minutes
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

/**
 * TanStack Query hooks for Tours API
 * Provides data fetching, mutations, and cache management for tours
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toursService } from '@/services/tours.service';
import type {
  AdminTour,
  AdminTourSummary,
  TourInput,
  ToursFilters,
  TourStats,
  City,
} from '@/services/tours.service';

// Query keys factory
export const toursKeys = {
  all: ['tours'] as const,
  lists: () => [...toursKeys.all, 'list'] as const,
  list: (filters?: ToursFilters) => [...toursKeys.lists(), filters] as const,
  details: () => [...toursKeys.all, 'detail'] as const,
  detail: (id: string) => [...toursKeys.details(), id] as const,
  stats: () => [...toursKeys.all, 'stats'] as const,
  cities: () => [...toursKeys.all, 'cities'] as const,
};

/**
 * Hook to fetch tours list with optional filters
 */
export function useTours(
  filters?: ToursFilters,
  options?: Omit<
    UseQueryOptions<AdminTourSummary[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: toursKeys.list(filters),
    queryFn: () => toursService.getTours(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch a single tour by ID
 */
export function useTour(
  id: string,
  options?: Omit<UseQueryOptions<AdminTour, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: toursKeys.detail(id),
    queryFn: () => toursService.getTourById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch dashboard statistics
 */
export function useTourStats(
  options?: Omit<UseQueryOptions<TourStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: toursKeys.stats(),
    queryFn: () => toursService.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Hook to fetch cities with tour counts
 */
export function useCities(
  options?: Omit<UseQueryOptions<City[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: toursKeys.cities(),
    queryFn: () => toursService.getCities(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook to create a new tour
 */
export function useCreateTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TourInput) => toursService.createTour(input),
    onSuccess: () => {
      // Invalidate tours list and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
      queryClient.invalidateQueries({ queryKey: toursKeys.cities() });
    },
  });
}

/**
 * Hook to update an existing tour
 */
export function useUpdateTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TourInput> }) =>
      toursService.updateTour(id, input),
    onSuccess: (data) => {
      // Update specific tour in cache
      queryClient.setQueryData(toursKeys.detail(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
    },
  });
}

/**
 * Hook to delete a tour
 */
export function useDeleteTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toursService.deleteTour(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: toursKeys.detail(id) });
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
      queryClient.invalidateQueries({ queryKey: toursKeys.cities() });
    },
  });
}

/**
 * Hook to bulk delete tours
 */
export function useBulkDeleteTours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => toursService.bulkDelete(ids),
    onSuccess: (_, ids) => {
      // Remove all deleted tours from cache
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: toursKeys.detail(id) });
      });
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
      queryClient.invalidateQueries({ queryKey: toursKeys.cities() });
    },
  });
}

/**
 * Hook to duplicate a tour
 */
export function useDuplicateTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toursService.duplicateTour(id),
    onSuccess: () => {
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
      queryClient.invalidateQueries({ queryKey: toursKeys.cities() });
    },
  });
}

/**
 * Hook to publish a tour
 */
export function usePublishTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toursService.publishTour(id),
    onSuccess: (data) => {
      // Update specific tour in cache
      queryClient.setQueryData(toursKeys.detail(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
    },
  });
}

/**
 * Hook to archive a tour
 */
export function useArchiveTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toursService.archiveTour(id),
    onSuccess: (data) => {
      // Update specific tour in cache
      queryClient.setQueryData(toursKeys.detail(data.id), data);
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: toursKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toursKeys.stats() });
    },
  });
}

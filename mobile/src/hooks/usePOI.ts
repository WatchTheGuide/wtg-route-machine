import { useQuery } from '@tanstack/react-query';
import { poiService } from '../services/poi.service';
import { useCityStore } from '../stores/cityStore';
import { POI, POICategory } from '../types';

/**
 * Query keys dla POI
 */
export const poiQueryKeys = {
  all: ['pois'] as const,
  city: (cityId: string) => [...poiQueryKeys.all, cityId] as const,
  cityCategory: (cityId: string, category: POICategory) =>
    [...poiQueryKeys.city(cityId), category] as const,
  single: (cityId: string, poiId: string) =>
    [...poiQueryKeys.city(cityId), poiId] as const,
  categories: ['categories'] as const,
  search: (cityId: string, query: string) =>
    [...poiQueryKeys.city(cityId), 'search', query] as const,
};

interface UsePOIOptions {
  /** Filtruj po kategorii */
  category?: POICategory;
  /** Włącz/wyłącz zapytanie */
  enabled?: boolean;
}

interface UsePOIReturn {
  /** Lista POI */
  pois: POI[];
  /** Czy ładowanie */
  isLoading: boolean;
  /** Czy błąd */
  isError: boolean;
  /** Komunikat błędu */
  error: Error | null;
  /** Odśwież dane */
  refetch: () => void;
}

/**
 * Hook do pobierania POI dla aktualnego miasta
 * Używa TanStack Query do cache'owania i zarządzania stanem
 */
export const usePOI = (options: UsePOIOptions = {}): UsePOIReturn => {
  const { category, enabled = true } = options;
  const { currentCity } = useCityStore();

  const queryKey = category
    ? poiQueryKeys.cityCategory(currentCity.id, category)
    : poiQueryKeys.city(currentCity.id);

  const query = useQuery({
    queryKey,
    queryFn: () => poiService.fetchPOIs(currentCity.id, category),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 30 * 60 * 1000, // 30 minut (garbage collection)
  });

  return {
    pois: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

interface UseSinglePOIReturn {
  /** Pojedynczy POI */
  poi: POI | null;
  /** Czy ładowanie */
  isLoading: boolean;
  /** Czy błąd */
  isError: boolean;
  /** Komunikat błędu */
  error: Error | null;
}

/**
 * Hook do pobierania pojedynczego POI
 */
export const useSinglePOI = (poiId: string | null): UseSinglePOIReturn => {
  const { currentCity } = useCityStore();

  const query = useQuery({
    queryKey: poiQueryKeys.single(currentCity.id, poiId ?? ''),
    queryFn: () => poiService.fetchPOI(currentCity.id, poiId!),
    enabled: !!poiId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    poi: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

interface UseSearchPOIOptions {
  /** Minimalna długość zapytania (domyślnie 2) */
  minQueryLength?: number;
}

interface UseSearchPOIReturn {
  /** Wyniki wyszukiwania */
  results: POI[];
  /** Czy ładowanie */
  isLoading: boolean;
  /** Czy błąd */
  isError: boolean;
}

/**
 * Hook do wyszukiwania POI
 */
export const useSearchPOI = (
  query: string,
  options: UseSearchPOIOptions = {}
): UseSearchPOIReturn => {
  const { minQueryLength = 2 } = options;
  const { currentCity } = useCityStore();

  const searchQuery = useQuery({
    queryKey: poiQueryKeys.search(currentCity.id, query),
    queryFn: () => poiService.searchPOIs(currentCity.id, query),
    enabled: query.length >= minQueryLength,
    staleTime: 2 * 60 * 1000,
  });

  return {
    results: searchQuery.data ?? [],
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
  };
};

export default usePOI;

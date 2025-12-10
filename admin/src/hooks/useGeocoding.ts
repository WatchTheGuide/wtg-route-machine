/**
 * useGeocoding Hook (US 8.6.1)
 *
 * React hook for forward and reverse geocoding using Nominatim API.
 * Features:
 * - Address search with debouncing
 * - Reverse geocoding (coordinates → address)
 * - Loading states
 * - Error handling
 * - City bounding box support
 */

import { useState, useCallback, useRef } from 'react';
import {
  geocodingService,
  type GeocodingResult,
  type ReverseGeocodingResult,
  type BoundingBox,
} from '@/services/geocoding.service';

export interface UseGeocodingOptions {
  /** City bounding box to limit search results */
  boundingBox?: BoundingBox;
  /** Maximum number of results to return (default: 10) */
  limit?: number;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

export interface UseGeocodingReturn {
  /** Search results from last query */
  results: GeocodingResult[];
  /** Whether a search is in progress */
  isSearching: boolean;
  /** Whether reverse geocoding is in progress */
  isReverseGeocoding: boolean;
  /** Error message if last operation failed */
  error: string | null;
  /** Search for an address (immediate, no debounce) */
  searchAddress: (query: string) => Promise<void>;
  /** Search for an address with debouncing */
  debouncedSearch: (query: string) => void;
  /** Get address from coordinates */
  getAddressFromCoordinates: (
    lat: number,
    lon: number
  ) => Promise<ReverseGeocodingResult | null>;
  /** Clear search results and error */
  clearResults: () => void;
}

export function useGeocoding(
  options: UseGeocodingOptions = {}
): UseGeocodingReturn {
  const { boundingBox, limit = 10, debounceMs = 300 } = options;

  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Search for an address (immediate, no debounce)
   */
  const searchAddress = useCallback(
    async (query: string): Promise<void> => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = await geocodingService.searchAddress(query, {
          boundingBox,
          limit,
        });
        setResults(searchResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [boundingBox, limit]
  );

  /**
   * Search for an address with debouncing
   */
  const debouncedSearch = useCallback(
    (query: string): void => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!query.trim()) {
        setResults([]);
        return;
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        searchAddress(query);
      }, debounceMs);
    },
    [searchAddress, debounceMs]
  );

  /**
   * Get address from coordinates (reverse geocoding)
   */
  const getAddressFromCoordinates = useCallback(
    async (
      lat: number,
      lon: number
    ): Promise<ReverseGeocodingResult | null> => {
      setIsReverseGeocoding(true);

      try {
        const result = await geocodingService.getAddressFromCoordinates(
          lat,
          lon
        );
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    []
  );

  /**
   * Clear search results and error
   */
  const clearResults = useCallback((): void => {
    // Cancel pending debounced search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isSearching,
    isReverseGeocoding,
    error,
    searchAddress,
    debouncedSearch,
    getAddressFromCoordinates,
    clearResults,
  };
}

/**
 * Tests for useGeocoding Hook (US 8.6.1)
 *
 * TDD approach: Tests for React hook that wraps geocoding service
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeocoding } from './useGeocoding';
import { geocodingService } from '@/services/geocoding.service';

// Mock the geocoding service
vi.mock('@/services/geocoding.service', () => ({
  geocodingService: {
    searchAddress: vi.fn(),
    getAddressFromCoordinates: vi.fn(),
    clearCache: vi.fn(),
  },
}));

const mockGeocodingService = vi.mocked(geocodingService);

describe('useGeocoding Hook (US 8.6.1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Forward Geocoding (Address Search)
  // ============================================
  describe('searchAddress', () => {
    it('should search for an address and return results', async () => {
      // Arrange
      const mockResults = [
        {
          displayName: 'Rynek Główny, Kraków',
          lat: 50.0619,
          lon: 19.9372,
          type: 'square',
          importance: 0.9,
          boundingBox: [50.06, 50.065, 19.935, 19.94] as [
            number,
            number,
            number,
            number
          ],
        },
      ];
      mockGeocodingService.searchAddress.mockResolvedValueOnce(mockResults);

      // Act
      const { result } = renderHook(() => useGeocoding());

      await act(async () => {
        await result.current.searchAddress('Rynek');
      });

      // Assert
      expect(result.current.results).toEqual(mockResults);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set isSearching to true while searching', async () => {
      // Arrange
      mockGeocodingService.searchAddress.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      // Act
      const { result } = renderHook(() => useGeocoding());

      // Start search but don't await
      act(() => {
        result.current.searchAddress('test');
      });

      // Assert - should be searching
      expect(result.current.isSearching).toBe(true);

      // Wait for completion
      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('should handle search errors', async () => {
      // Arrange
      const error = new Error('Network error');
      mockGeocodingService.searchAddress.mockRejectedValueOnce(error);

      // Act
      const { result } = renderHook(() => useGeocoding());

      await act(async () => {
        await result.current.searchAddress('test');
      });

      // Assert
      expect(result.current.error).toBe('Network error');
      expect(result.current.results).toEqual([]);
      expect(result.current.isSearching).toBe(false);
    });

    it('should clear previous results when starting new search', async () => {
      // Arrange
      const firstResults = [
        {
          displayName: 'First',
          lat: 50,
          lon: 19,
          type: 'place',
          importance: 0.5,
          boundingBox: [49, 51, 18, 20] as [number, number, number, number],
        },
      ];
      const secondResults = [
        {
          displayName: 'Second',
          lat: 51,
          lon: 20,
          type: 'place',
          importance: 0.5,
          boundingBox: [50, 52, 19, 21] as [number, number, number, number],
        },
      ];

      mockGeocodingService.searchAddress
        .mockResolvedValueOnce(firstResults)
        .mockResolvedValueOnce(secondResults);

      // Act
      const { result } = renderHook(() => useGeocoding());

      await act(async () => {
        await result.current.searchAddress('first');
      });
      expect(result.current.results).toEqual(firstResults);

      await act(async () => {
        await result.current.searchAddress('second');
      });

      // Assert
      expect(result.current.results).toEqual(secondResults);
    });

    it('should pass bounding box to service', async () => {
      // Arrange
      const boundingBox = { minLon: 19, minLat: 50, maxLon: 20, maxLat: 51 };
      mockGeocodingService.searchAddress.mockResolvedValueOnce([]);

      // Act
      const { result } = renderHook(() => useGeocoding({ boundingBox }));

      await act(async () => {
        await result.current.searchAddress('test');
      });

      // Assert
      expect(mockGeocodingService.searchAddress).toHaveBeenCalledWith('test', {
        boundingBox,
        limit: 10,
      });
    });
  });

  // ============================================
  // Reverse Geocoding
  // ============================================
  describe('getAddressFromCoordinates', () => {
    it('should get address from coordinates', async () => {
      // Arrange
      const mockResult = {
        displayName: 'ul. Floriańska 15, Kraków',
        street: 'Floriańska',
        houseNumber: '15',
        city: 'Kraków',
        country: 'Poland',
        formattedAddress: 'ul. Floriańska 15',
      };
      mockGeocodingService.getAddressFromCoordinates.mockResolvedValueOnce(
        mockResult
      );

      // Act
      const { result } = renderHook(() => useGeocoding());

      let address;
      await act(async () => {
        address = await result.current.getAddressFromCoordinates(
          50.063,
          19.941
        );
      });

      // Assert
      expect(address).toEqual(mockResult);
      expect(result.current.isReverseGeocoding).toBe(false);
    });

    it('should set isReverseGeocoding while fetching', async () => {
      // Arrange
      mockGeocodingService.getAddressFromCoordinates.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ displayName: 'Test', formattedAddress: 'Test' }),
              100
            )
          )
      );

      // Act
      const { result } = renderHook(() => useGeocoding());

      act(() => {
        result.current.getAddressFromCoordinates(50, 19);
      });

      // Assert
      expect(result.current.isReverseGeocoding).toBe(true);

      await waitFor(() => {
        expect(result.current.isReverseGeocoding).toBe(false);
      });
    });

    it('should return null when reverse geocoding fails', async () => {
      // Arrange
      mockGeocodingService.getAddressFromCoordinates.mockResolvedValueOnce(
        null
      );

      // Act
      const { result } = renderHook(() => useGeocoding());

      let address;
      await act(async () => {
        address = await result.current.getAddressFromCoordinates(0, 0);
      });

      // Assert
      expect(address).toBeNull();
    });
  });

  // ============================================
  // Clear Results
  // ============================================
  describe('clearResults', () => {
    it('should clear search results', async () => {
      // Arrange
      const mockResults = [
        {
          displayName: 'Test',
          lat: 50,
          lon: 19,
          type: 'place',
          importance: 0.5,
          boundingBox: [49, 51, 18, 20] as [number, number, number, number],
        },
      ];
      mockGeocodingService.searchAddress.mockResolvedValueOnce(mockResults);

      // Act
      const { result } = renderHook(() => useGeocoding());

      await act(async () => {
        await result.current.searchAddress('test');
      });
      expect(result.current.results).toHaveLength(1);

      act(() => {
        result.current.clearResults();
      });

      // Assert
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  // ============================================
  // Debouncing
  // ============================================
  describe('debouncedSearch', () => {
    it('should debounce search calls', async () => {
      // Arrange
      vi.useFakeTimers();
      mockGeocodingService.searchAddress.mockResolvedValue([]);

      // Act
      const { result } = renderHook(() => useGeocoding({ debounceMs: 300 }));

      // Rapid calls
      act(() => {
        result.current.debouncedSearch('a');
        result.current.debouncedSearch('ab');
        result.current.debouncedSearch('abc');
      });

      // Assert - no calls yet
      expect(mockGeocodingService.searchAddress).not.toHaveBeenCalled();

      // Advance time
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Assert - only one call with final value
      expect(mockGeocodingService.searchAddress).toHaveBeenCalledTimes(1);
      expect(mockGeocodingService.searchAddress).toHaveBeenCalledWith(
        'abc',
        expect.any(Object)
      );

      vi.useRealTimers();
    });

    it('should cancel debounced search when clearResults is called', async () => {
      // Arrange
      vi.useFakeTimers();
      mockGeocodingService.searchAddress.mockResolvedValue([]);

      // Act
      const { result } = renderHook(() => useGeocoding({ debounceMs: 300 }));

      act(() => {
        result.current.debouncedSearch('test');
      });

      act(() => {
        result.current.clearResults();
      });

      // Advance time
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Assert - should not have called search
      expect(mockGeocodingService.searchAddress).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});

/**
 * Tests for useExport Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExport } from './useExport';
import { exportService } from '../services/export.service';
import { Route, Waypoint, City, CITIES } from '../types/route.types';

// Mock export service
vi.mock('../services/export.service', () => ({
  exportService: {
    downloadGeoJSON: vi.fn(),
    generatePDFDefinition: vi.fn().mockReturnValue({}),
    shareRoute: vi.fn(),
  },
}));

describe('useExport', () => {
  const mockRoute: Route = {
    coordinates: [
      [19.9385, 50.0647],
      [19.94, 50.065],
    ],
    distance: 1000,
    duration: 600,
  };

  const mockWaypoints: Waypoint[] = [
    { id: '1', coordinate: [19.9385, 50.0647], address: 'Point A' },
    { id: '2', coordinate: [19.94, 50.065], address: 'Point B' },
  ];

  const mockInstructions = [
    { text: 'Start', distance: 0, maneuverType: 'depart', icon: 'play' },
    { text: 'Arrive', distance: 0, maneuverType: 'arrive', icon: 'flag' },
  ];

  const mockCity: City = CITIES[0]; // Kraków

  const defaultProps = {
    route: mockRoute,
    waypoints: mockWaypoints,
    instructions: mockInstructions,
    profile: 'foot' as const,
    city: mockCity,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should not be exporting initially', () => {
      const { result } = renderHook(() => useExport(defaultProps));
      expect(result.current.isExporting).toBe(false);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() => useExport(defaultProps));
      expect(result.current.error).toBeNull();
    });
  });

  describe('exportGeoJSON', () => {
    it('should call exportService.downloadGeoJSON with correct params', () => {
      const { result } = renderHook(() => useExport(defaultProps));

      act(() => {
        result.current.exportGeoJSON();
      });

      expect(exportService.downloadGeoJSON).toHaveBeenCalledWith(
        mockRoute,
        mockWaypoints,
        expect.objectContaining({
          cityName: 'Kraków',
          profile: 'foot',
          profileName: 'Pieszo',
        })
      );
    });

    it('should set error when no route available', () => {
      const { result } = renderHook(() =>
        useExport({ ...defaultProps, route: null })
      );

      act(() => {
        result.current.exportGeoJSON();
      });

      expect(result.current.error).toContain('Brak trasy');
      expect(exportService.downloadGeoJSON).not.toHaveBeenCalled();
    });

    it('should handle export errors', () => {
      vi.mocked(exportService.downloadGeoJSON).mockImplementation(() => {
        throw new Error('Export failed');
      });

      const { result } = renderHook(() => useExport(defaultProps));

      act(() => {
        result.current.exportGeoJSON();
      });

      expect(result.current.error).toContain('Nie udało się');
    });
  });

  describe('exportPDF', () => {
    it('should set error when no route available', () => {
      const { result } = renderHook(() =>
        useExport({ ...defaultProps, route: null })
      );

      act(() => {
        result.current.exportPDF();
      });

      expect(result.current.error).toContain('Brak trasy');
    });

    it('should set error when pdfMake not loaded', () => {
      const { result } = renderHook(() => useExport(defaultProps));

      act(() => {
        result.current.exportPDF();
      });

      expect(result.current.error).toContain('PDF nie jest załadowana');
    });
  });

  describe('shareRoute', () => {
    it('should return false when no route available', async () => {
      const { result } = renderHook(() =>
        useExport({ ...defaultProps, route: null })
      );

      let shareResult: boolean = true;
      await act(async () => {
        shareResult = await result.current.shareRoute();
      });

      expect(shareResult).toBe(false);
      expect(result.current.error).toContain('Brak trasy');
    });

    it('should call exportService.shareRoute', async () => {
      vi.mocked(exportService.shareRoute).mockResolvedValue(true);

      const { result } = renderHook(() => useExport(defaultProps));

      await act(async () => {
        await result.current.shareRoute();
      });

      expect(exportService.shareRoute).toHaveBeenCalledWith(
        mockRoute,
        mockWaypoints,
        expect.any(Object)
      );
    });
  });

  describe('canShare', () => {
    it('should reflect Web Share API availability', () => {
      const { result } = renderHook(() => useExport(defaultProps));

      // In jsdom, navigator.share is undefined
      expect(result.current.canShare).toBe(false);
    });
  });

  describe('profile names', () => {
    it('should use correct profile name for bicycle', () => {
      const { result } = renderHook(() =>
        useExport({ ...defaultProps, profile: 'bicycle' })
      );

      act(() => {
        result.current.exportGeoJSON();
      });

      expect(exportService.downloadGeoJSON).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Array),
        expect.objectContaining({ profileName: 'Rower' })
      );
    });

    it('should use correct profile name for car', () => {
      const { result } = renderHook(() =>
        useExport({ ...defaultProps, profile: 'car' })
      );

      act(() => {
        result.current.exportGeoJSON();
      });

      expect(exportService.downloadGeoJSON).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Array),
        expect.objectContaining({ profileName: 'Samochód' })
      );
    });
  });
});

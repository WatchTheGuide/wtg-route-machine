/**
 * useExport Hook
 * Provides route export functionality (GeoJSON, PDF, Share)
 */

import { useCallback, useState } from 'react';
import { Route, Waypoint, RoutingProfile, City } from '../types/route.types';
import { NavigationInstruction } from '../services/osrm.service';
import { exportService, ExportOptions } from '../services/export.service';

// Declare pdfMake as global (loaded from CDN or npm)
declare const pdfMake:
  | {
      createPdf: (docDefinition: unknown) => {
        download: (filename: string) => void;
        open: () => void;
      };
    }
  | undefined;

export interface UseExportReturn {
  isExporting: boolean;
  error: string | null;
  exportGeoJSON: () => void;
  exportPDF: () => void;
  shareRoute: () => Promise<boolean>;
  canShare: boolean;
}

export interface UseExportProps {
  route: Route | null;
  waypoints: Waypoint[];
  instructions: NavigationInstruction[];
  profile: RoutingProfile;
  city: City;
}

/**
 * Get profile display name
 */
function getProfileName(profile: RoutingProfile): string {
  switch (profile) {
    case 'foot':
      return 'Pieszo';
    case 'bicycle':
      return 'Rower';
    case 'car':
      return 'Samochód';
    default:
      return 'Pieszo';
  }
}

/**
 * Custom hook for exporting routes
 */
export function useExport({
  route,
  waypoints,
  instructions,
  profile,
  city,
}: UseExportProps): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExportOptions = useCallback(
    (): ExportOptions => ({
      cityName: city.name,
      profile,
      profileName: getProfileName(profile),
    }),
    [city.name, profile]
  );

  /**
   * Export route as GeoJSON file
   */
  const exportGeoJSON = useCallback(() => {
    if (!route) {
      setError('Brak trasy do eksportu. Wyznacz trasę przed eksportem.');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);
      exportService.downloadGeoJSON(route, waypoints, getExportOptions());
    } catch (err) {
      console.error('GeoJSON export error:', err);
      setError('Nie udało się wyeksportować trasy do GeoJSON.');
    } finally {
      setIsExporting(false);
    }
  }, [route, waypoints, getExportOptions]);

  /**
   * Export route as PDF file
   */
  const exportPDF = useCallback(() => {
    if (!route) {
      setError('Brak trasy do eksportu. Wyznacz trasę przed eksportem.');
      return;
    }

    if (typeof pdfMake === 'undefined') {
      setError('Biblioteka PDF nie jest załadowana. Odśwież stronę.');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      const docDefinition = exportService.generatePDFDefinition(
        route,
        waypoints,
        instructions,
        getExportOptions()
      );

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);
      const filename = `guidetrackee-route-${timestamp}.pdf`;

      pdfMake.createPdf(docDefinition).download(filename);
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Nie udało się wyeksportować trasy do PDF.');
    } finally {
      setIsExporting(false);
    }
  }, [route, waypoints, instructions, getExportOptions]);

  /**
   * Share route using Web Share API
   */
  const shareRoute = useCallback(async (): Promise<boolean> => {
    if (!route) {
      setError('Brak trasy do udostępnienia.');
      return false;
    }

    try {
      setIsExporting(true);
      setError(null);
      const success = await exportService.shareRoute(
        route,
        waypoints,
        getExportOptions()
      );
      return success;
    } catch (err) {
      console.error('Share error:', err);
      setError('Nie udało się udostępnić trasy.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [route, waypoints, getExportOptions]);

  /**
   * Check if Web Share API is available
   */
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return {
    isExporting,
    error,
    exportGeoJSON,
    exportPDF,
    shareRoute,
    canShare,
  };
}

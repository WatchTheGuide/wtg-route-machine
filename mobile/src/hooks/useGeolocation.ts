import { useState, useEffect, useCallback } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Coordinate } from '../types';

interface UseGeolocationReturn {
  /** Aktualna pozycja użytkownika [lon, lat] */
  position: Coordinate | null;
  /** Czy trwa pobieranie pozycji */
  isLoading: boolean;
  /** Błąd geolokacji */
  error: string | null;
  /** Dokładność pozycji w metrach */
  accuracy: number | null;
  /** Pobierz aktualną pozycję */
  getCurrentPosition: () => Promise<Coordinate | null>;
  /** Rozpocznij śledzenie pozycji */
  startWatching: () => Promise<void>;
  /** Zatrzymaj śledzenie pozycji */
  stopWatching: () => void;
}

/**
 * Hook do zarządzania geolokacją użytkownika
 * Używa Capacitor Geolocation dla natywnych platform
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<Coordinate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);

  /**
   * Konwertuje Position z Capacitor na Coordinate [lon, lat]
   */
  const positionToCoordinate = (pos: Position): Coordinate => {
    return [pos.coords.longitude, pos.coords.latitude];
  };

  /**
   * Sprawdza i żąda uprawnień do geolokacji
   */
  const checkPermissions = async (): Promise<boolean> => {
    try {
      const status = await Geolocation.checkPermissions();

      if (
        status.location === 'granted' ||
        status.coarseLocation === 'granted'
      ) {
        return true;
      }

      if (status.location === 'prompt' || status.coarseLocation === 'prompt') {
        const result = await Geolocation.requestPermissions();
        return (
          result.location === 'granted' || result.coarseLocation === 'granted'
        );
      }

      return false;
    } catch (err) {
      console.error('Error checking geolocation permissions:', err);
      return false;
    }
  };

  /**
   * Pobiera aktualną pozycję
   */
  const getCurrentPosition =
    useCallback(async (): Promise<Coordinate | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Na platformach natywnych sprawdź uprawnienia
        if (Capacitor.isNativePlatform()) {
          const hasPermission = await checkPermissions();
          if (!hasPermission) {
            setError('Brak uprawnień do geolokacji');
            setIsLoading(false);
            return null;
          }
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        const coord = positionToCoordinate(pos);
        setPosition(coord);
        setAccuracy(pos.coords.accuracy);
        setIsLoading(false);
        return coord;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Nie udało się pobrać pozycji';
        setError(message);
        setIsLoading(false);
        return null;
      }
    }, []);

  /**
   * Rozpoczyna śledzenie pozycji
   */
  const startWatching = useCallback(async (): Promise<void> => {
    if (watchId) return; // Już śledzimy

    try {
      if (Capacitor.isNativePlatform()) {
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          setError('Brak uprawnień do geolokacji');
          return;
        }
      }

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
        (pos, err) => {
          if (err) {
            setError(err.message);
            return;
          }
          if (pos) {
            setPosition(positionToCoordinate(pos));
            setAccuracy(pos.coords.accuracy);
            setError(null);
          }
        }
      );

      setWatchId(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Nie udało się włączyć śledzenia';
      setError(message);
    }
  }, [watchId]);

  /**
   * Zatrzymuje śledzenie pozycji
   */
  const stopWatching = useCallback(() => {
    if (watchId) {
      Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
  }, [watchId]);

  // Cleanup przy odmontowaniu
  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  return {
    position,
    isLoading,
    error,
    accuracy,
    getCurrentPosition,
    startWatching,
    stopWatching,
  };
};

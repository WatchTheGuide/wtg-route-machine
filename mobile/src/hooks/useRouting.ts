import { useState, useCallback, useEffect } from 'react';
import { useCityStore } from '../stores/cityStore';
import { osrmService } from '../services/osrm.service';
import { Coordinate, Route, RoutingProfile, Waypoint } from '../types';

interface UseRoutingReturn {
  /** Obliczona trasa */
  route: Route | null;
  /** Czy trwa obliczanie */
  isCalculating: boolean;
  /** Błąd obliczania */
  error: string | null;
  /** Aktualny profil */
  profile: RoutingProfile;
  /** Zmień profil */
  setProfile: (profile: RoutingProfile) => void;
  /** Oblicz trasę */
  calculateRoute: (waypoints: Waypoint[]) => Promise<void>;
  /** Wyczyść trasę */
  clearRoute: () => void;
}

/**
 * Hook do obliczania tras przez OSRM
 */
export const useRouting = (): UseRoutingReturn => {
  const { currentCity } = useCityStore();
  const [route, setRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<RoutingProfile>('foot');

  // Ustaw bazowy URL na podstawie aktualnego miasta
  useEffect(() => {
    const baseUrl = `http://localhost:${currentCity.port}`;
    osrmService.setBaseUrl(baseUrl);
  }, [currentCity]);

  const calculateRoute = useCallback(
    async (waypoints: Waypoint[]) => {
      if (waypoints.length < 2) {
        setError('Potrzeba minimum 2 punktów do obliczenia trasy');
        return;
      }

      setIsCalculating(true);
      setError(null);

      try {
        const coordinates: Coordinate[] = waypoints.map((wp) => wp.coordinate);
        const calculatedRoute = await osrmService.calculateRoute(
          coordinates,
          profile
        );
        setRoute(calculatedRoute);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Nieznany błąd';
        setError(message);
        setRoute(null);
      } finally {
        setIsCalculating(false);
      }
    },
    [profile]
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return {
    route,
    isCalculating,
    error,
    profile,
    setProfile,
    calculateRoute,
    clearRoute,
  };
};

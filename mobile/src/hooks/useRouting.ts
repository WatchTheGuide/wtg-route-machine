import { useCallback, useEffect } from 'react';
import { useCityStore } from '../stores/cityStore';
import { useRoutePlannerStore } from '../stores/routePlannerStore';
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
 * Używa globalnego routePlannerStore dla profilu, trasy i stanu
 */
export const useRouting = (): UseRoutingReturn => {
  const { currentCity } = useCityStore();

  // Pobierz stan z globalnego store
  const route = useRoutePlannerStore((state) => state.route);
  const profile = useRoutePlannerStore((state) => state.profile);
  const isCalculating = useRoutePlannerStore((state) => state.isCalculating);
  const error = useRoutePlannerStore((state) => state.error);

  // Pobierz akcje z globalnego store
  const storeSetRoute = useRoutePlannerStore((state) => state.setRoute);
  const storeSetProfile = useRoutePlannerStore((state) => state.setProfile);
  const storeSetCalculating = useRoutePlannerStore(
    (state) => state.setCalculating
  );
  const storeSetError = useRoutePlannerStore((state) => state.setError);
  const storeClearRoute = useRoutePlannerStore((state) => state.clearRoute);

  // Ustaw bazowy URL na podstawie aktualnego miasta i profilu
  useEffect(() => {
    // Zabezpieczenie na wypadek starej struktury danych (migracja)
    const port = currentCity.ports?.[profile] ?? 5001;
    const baseUrl = `http://localhost:${port}`;
    osrmService.setBaseUrl(baseUrl);
  }, [currentCity, profile]);

  const calculateRoute = useCallback(
    async (waypoints: Waypoint[]) => {
      if (waypoints.length < 2) {
        storeSetError('Potrzeba minimum 2 punktów do obliczenia trasy');
        return;
      }

      storeSetCalculating(true);
      storeSetError(null);

      try {
        const coordinates: Coordinate[] = waypoints.map((wp) => wp.coordinate);
        const calculatedRoute = await osrmService.calculateRoute(
          coordinates,
          profile
        );
        storeSetRoute(calculatedRoute);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Nieznany błąd';
        storeSetError(message);
        storeSetRoute(null);
      } finally {
        storeSetCalculating(false);
      }
    },
    [profile, storeSetRoute, storeSetCalculating, storeSetError]
  );

  const setProfile = useCallback(
    (newProfile: RoutingProfile) => {
      storeSetProfile(newProfile);
    },
    [storeSetProfile]
  );

  const clearRoute = useCallback(() => {
    storeClearRoute();
  }, [storeClearRoute]);

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

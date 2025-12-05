/**
 * useRouting Hook
 * Manages routing state and operations using OSRM service
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Route,
  RoutingProfile,
  Waypoint,
  City,
  CITIES,
} from '../types/route.types';
import {
  osrmService,
  OsrmError,
  NavigationInstruction,
} from '../services/osrm.service';

export interface UseRoutingReturn {
  route: Route | null;
  isLoading: boolean;
  error: string | null;
  profile: RoutingProfile;
  city: City;
  instructions: NavigationInstruction[];
  setProfile: (profile: RoutingProfile) => void;
  setCity: (city: City) => void;
  calculateRoute: (waypoints: Waypoint[]) => Promise<void>;
  clearRoute: () => void;
}

/**
 * Custom hook for managing routing
 */
export function useRouting(): UseRoutingReturn {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<RoutingProfile>('foot');
  const [city, setCity] = useState<City>(CITIES[0]); // Default to Kraków
  const [instructions, setInstructions] = useState<NavigationInstruction[]>([]);

  // Track previous waypoints for auto-recalculation
  const previousWaypointsRef = useRef<string>('');

  /**
   * Calculate route between waypoints
   */
  const calculateRoute = useCallback(
    async (waypoints: Waypoint[]): Promise<void> => {
      if (waypoints.length < 2) {
        setRoute(null);
        setInstructions([]);
        setError(null);
        return;
      }

      // Check if waypoints changed
      const waypointsKey = waypoints
        .map((wp) => `${wp.coordinate[0]},${wp.coordinate[1]}`)
        .join(';');

      setIsLoading(true);
      setError(null);

      try {
        const coordinates = waypoints.map((wp) => wp.coordinate);
        const routeResult = await osrmService.calculateRoute(
          coordinates,
          profile,
          city.id
        );

        setRoute(routeResult);
        setInstructions(routeResult.instructions || []);
        previousWaypointsRef.current = waypointsKey;
      } catch (err) {
        console.error('Routing error:', err);

        if (err instanceof OsrmError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(
            'Nie można połączyć się z serwerem routingu. Sprawdź połączenie internetowe.'
          );
        } else {
          setError('Wystąpił nieznany błąd podczas wyznaczania trasy.');
        }

        setRoute(null);
        setInstructions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [profile, city]
  );

  /**
   * Clear current route
   */
  const clearRoute = useCallback((): void => {
    setRoute(null);
    setInstructions([]);
    setError(null);
    previousWaypointsRef.current = '';
  }, []);

  /**
   * Handle profile change - will trigger recalculation if route exists
   */
  const handleSetProfile = useCallback((newProfile: RoutingProfile): void => {
    setProfile(newProfile);
  }, []);

  /**
   * Handle city change
   */
  const handleSetCity = useCallback((newCity: City): void => {
    setCity(newCity);
  }, []);

  return {
    route,
    isLoading,
    error,
    profile,
    city,
    instructions,
    setProfile: handleSetProfile,
    setCity: handleSetCity,
    calculateRoute,
    clearRoute,
  };
}

/**
 * Hook to auto-recalculate route when waypoints, profile, or city change
 */
export function useAutoRouting(
  waypoints: Waypoint[],
  profile: RoutingProfile,
  calculateRoute: (waypoints: Waypoint[]) => Promise<void>,
  cityId?: string
): void {
  const waypointsRef = useRef<string>('');
  const profileRef = useRef<RoutingProfile>(profile);
  const cityRef = useRef<string | undefined>(cityId);

  useEffect(() => {
    const waypointsKey = waypoints
      .map((wp) => `${wp.coordinate[0]},${wp.coordinate[1]}`)
      .join(';');

    // Only recalculate if waypoints, profile, or city changed
    if (
      waypointsKey !== waypointsRef.current ||
      profile !== profileRef.current ||
      cityId !== cityRef.current
    ) {
      waypointsRef.current = waypointsKey;
      profileRef.current = profile;
      cityRef.current = cityId;

      if (waypoints.length >= 2) {
        calculateRoute(waypoints);
      }
    }
  }, [waypoints, profile, calculateRoute, cityId]);
}

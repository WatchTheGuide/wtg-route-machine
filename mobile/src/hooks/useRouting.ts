/**
 * useRouting - Hook for route calculation with OSRM
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { osrmService } from '../services/osrm.service';
import { Route, RoutingProfile, Waypoint } from '../types';
import { useCityStore } from '../stores';

interface UseRoutingOptions {
  onSuccess?: (route: Route) => void;
  onError?: (error: Error) => void;
}

export function useRouting(options?: UseRoutingOptions) {
  const [route, setRoute] = useState<Route | null>(null);
  const [profile, setProfile] = useState<RoutingProfile>('walking');
  const { selectedCity } = useCityStore();

  const mutation = useMutation({
    mutationFn: async (waypoints: Waypoint[]) => {
      const result = await osrmService.calculateRoute(
        waypoints,
        selectedCity.id,
        profile
      );
      if (!result) {
        throw new Error('Nie udało się obliczyć trasy');
      }
      return result;
    },
    onSuccess: (data) => {
      setRoute(data);
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('Routing error:', error);
      options?.onError?.(error);
    },
  });

  const calculateRoute = useCallback(
    (waypoints: Waypoint[]) => {
      if (waypoints.length < 2) {
        console.warn('Need at least 2 waypoints');
        return;
      }
      mutation.mutate(waypoints);
    },
    [mutation]
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
    mutation.reset();
  }, [mutation]);

  const changeProfile = useCallback((newProfile: RoutingProfile) => {
    setProfile(newProfile);
  }, []);

  // Format distance for display
  const formatDistance = useCallback((meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }, []);

  // Format duration for display
  const formatDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} godz. ${minutes} min`;
    }
    return `${minutes} min`;
  }, []);

  return {
    route,
    profile,
    isCalculating: mutation.isPending,
    error: mutation.error,
    calculateRoute,
    clearRoute,
    changeProfile,
    formatDistance,
    formatDuration,
  };
}

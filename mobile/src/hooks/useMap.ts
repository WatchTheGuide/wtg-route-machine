import React, { useCallback, useState, useEffect } from 'react';
import { useCityStore } from '../stores/cityStore';
import { Coordinate } from '../types';

interface UseMapState {
  center: Coordinate;
  zoom: number;
}

interface UseMapReturn {
  /** Aktualne centrum mapy */
  center: Coordinate;
  /** Aktualny poziom zoomu */
  zoom: number;
  /** Zmień centrum mapy */
  setCenter: (center: Coordinate) => void;
  /** Zmień poziom zoomu */
  setZoom: (zoom: number) => void;
  /** Przesuń mapę do wskazanej lokalizacji z animacją */
  flyTo: (coordinate: Coordinate, zoom?: number) => void;
  /** Przesuń mapę do aktualnego miasta */
  goToCurrentCity: () => void;
}

/**
 * Hook do zarządzania stanem mapy
 * Integruje się z cityStore dla centrum aktualnego miasta
 */
export const useMap = (initialZoom = 14): UseMapReturn => {
  const { currentCity } = useCityStore();

  // Pobierz centrum aktualnego miasta
  const defaultCenter: Coordinate = currentCity?.center || [19.9449, 50.0647];

  const [state, setState] = useState<UseMapState>({
    center: defaultCenter,
    zoom: initialZoom,
  });

  // Ref do śledzenia poprzedniego miasta (aby nie reagować na pierwszą inicjalizację)
  const prevCityIdRef = React.useRef(currentCity?.id);

  // Reaguj na zmiany miasta (np. z ActionSheet lub po hydratacji z Preferences)
  useEffect(() => {
    if (currentCity && prevCityIdRef.current !== currentCity.id) {
      prevCityIdRef.current = currentCity.id;
      setState({
        center: currentCity.center,
        zoom: 14,
      });
    }
  }, [currentCity]);

  const setCenter = useCallback((center: Coordinate) => {
    setState((prev) => ({ ...prev, center }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom }));
  }, []);

  const flyTo = useCallback((coordinate: Coordinate, zoom?: number) => {
    setState((prev) => ({
      center: coordinate,
      zoom: zoom ?? prev.zoom,
    }));
  }, []);

  const goToCurrentCity = useCallback(() => {
    if (currentCity) {
      setState({
        center: currentCity.center,
        zoom: 14,
      });
    }
  }, [currentCity]);

  return {
    center: state.center,
    zoom: state.zoom,
    setCenter,
    setZoom,
    flyTo,
    goToCurrentCity,
  };
};

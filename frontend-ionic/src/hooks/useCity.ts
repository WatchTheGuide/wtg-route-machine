/**
 * useCity Hook
 * Manages city selection with localStorage persistence
 */

import { useState, useCallback } from 'react';
import {
  City,
  CITIES,
  DEFAULT_CITY_ID,
  getCityById,
} from '../types/route.types';

const CITY_STORAGE_KEY = 'guidetrackee_selected_city';

export interface UseCityReturn {
  city: City;
  cityId: string;
  cities: City[];
  setCity: (cityId: string) => void;
  getCityById: (cityId: string) => City | undefined;
}

/**
 * Load city from localStorage
 */
function loadSavedCity(): City {
  try {
    const savedCityId = localStorage.getItem(CITY_STORAGE_KEY);
    if (savedCityId) {
      const city = getCityById(savedCityId);
      if (city) {
        return city;
      }
    }
  } catch (error) {
    console.error('Failed to load city from localStorage:', error);
  }

  // Return default city (Kraków)
  return getCityById(DEFAULT_CITY_ID) || CITIES[0];
}

/**
 * Save city to localStorage
 */
function saveCity(cityId: string): void {
  try {
    localStorage.setItem(CITY_STORAGE_KEY, cityId);
  } catch (error) {
    console.error('Failed to save city to localStorage:', error);
  }
}

/**
 * Custom hook for managing city selection
 */
export function useCity(): UseCityReturn {
  const [city, setCityState] = useState<City>(loadSavedCity);

  // Handle city change
  const setCity = useCallback((cityId: string) => {
    const newCity = getCityById(cityId);
    if (newCity) {
      setCityState(newCity);
      saveCity(cityId);
    }
  }, []);

  return {
    city,
    cityId: city.id,
    cities: CITIES,
    setCity,
    getCityById,
  };
}

export default useCity;

/**
 * WTG Route Machine - City Store
 * Zustand store for managing selected city
 */

import { create } from 'zustand';
import { City, Coordinate } from '../types';

// Available cities
export const CITIES: Record<string, City> = {
  krakow: {
    id: 'krakow',
    name: 'Kraków',
    center: [19.9449, 50.0647], // [lon, lat]
    port: 5001,
  },
  warszawa: {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    port: 5002,
  },
  wroclaw: {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    port: 5003,
  },
  trojmiasto: {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    port: 5004,
  },
};

interface CityState {
  selectedCity: City;
  setCity: (cityId: string) => void;
  getCityList: () => City[];
}

export const useCityStore = create<CityState>((set, get) => ({
  selectedCity: CITIES.krakow,

  setCity: (cityId: string) => {
    const city = CITIES[cityId];
    if (city) {
      set({ selectedCity: city });
    }
  },

  getCityList: () => Object.values(CITIES),
}));

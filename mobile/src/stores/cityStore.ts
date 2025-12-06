import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';
import { City, CITIES } from '../types';

// Custom storage adapter for Capacitor Preferences
const capacitorStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const { value } = await Preferences.get({ key: name });
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    await Preferences.remove({ key: name });
  },
};

interface CityState {
  currentCity: City;
  setCity: (cityId: string) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      currentCity: CITIES.krakow,
      setCity: (cityId: string) => {
        const city = CITIES[cityId];
        if (city) {
          set({ currentCity: city });
        }
      },
    }),
    {
      name: 'city-storage',
      storage: createJSONStorage(() => capacitorStorage),
      // Migracja ze starej struktury (port) do nowej (ports)
      migrate: (persistedState: unknown) => {
        const state = persistedState as CityState;
        // Jeśli miasto ma starą strukturę (port zamiast ports), użyj świeżego miasta z CITIES
        if (state?.currentCity && !state.currentCity.ports) {
          const freshCity = CITIES[state.currentCity.id] || CITIES.krakow;
          return { ...state, currentCity: freshCity };
        }
        return state;
      },
      version: 1, // Zwiększ wersję aby wymusić migrację
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { City, CITIES } from '../types';

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
      storage: createJSONStorage(() => localStorage),
    }
  )
);

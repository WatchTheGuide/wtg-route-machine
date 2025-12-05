/**
 * WTG Routes - Settings Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // Navigation settings
  voiceNavigation: boolean;
  offlineMaps: boolean;

  // App settings
  darkMode: boolean;
  metricUnits: boolean;
  language: string;

  // Map settings
  defaultCity: string;
  defaultProfile: 'foot' | 'bicycle' | 'car';
  mapStyle: 'standard' | 'satellite' | 'terrain';

  // Actions
  setVoiceNavigation: (value: boolean) => void;
  setOfflineMaps: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setMetricUnits: (value: boolean) => void;
  setLanguage: (value: string) => void;
  setDefaultCity: (value: string) => void;
  setDefaultProfile: (value: 'foot' | 'bicycle' | 'car') => void;
  setMapStyle: (value: 'standard' | 'satellite' | 'terrain') => void;
  resetSettings: () => void;
}

const defaultSettings = {
  voiceNavigation: true,
  offlineMaps: false,
  darkMode: false,
  metricUnits: true,
  language: 'pl',
  defaultCity: 'krakow',
  defaultProfile: 'foot' as const,
  mapStyle: 'standard' as const,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setVoiceNavigation: (value) => set({ voiceNavigation: value }),
      setOfflineMaps: (value) => set({ offlineMaps: value }),
      setDarkMode: (value) => set({ darkMode: value }),
      setMetricUnits: (value) => set({ metricUnits: value }),
      setLanguage: (value) => set({ language: value }),
      setDefaultCity: (value) => set({ defaultCity: value }),
      setDefaultProfile: (value) => set({ defaultProfile: value }),
      setMapStyle: (value) => set({ mapStyle: value }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

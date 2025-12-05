/**
 * WTG Route Machine - Settings Store
 * Zustand store for app settings
 */

import { create } from 'zustand';
import { AppSettings, RoutingProfile } from '../types';

interface SettingsState extends AppSettings {
  setDefaultCity: (city: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setUnits: (units: 'metric' | 'imperial') => void;
  setDefaultProfile: (profile: RoutingProfile) => void;
  setNavigationVoice: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Default settings
  defaultCity: 'krakow',
  theme: 'system',
  units: 'metric',
  defaultProfile: 'foot',
  navigationVoice: true,

  // Actions
  setDefaultCity: (city) => set({ defaultCity: city }),
  setTheme: (theme) => set({ theme }),
  setUnits: (units) => set({ units }),
  setDefaultProfile: (profile) => set({ defaultProfile: profile }),
  setNavigationVoice: (enabled) => set({ navigationVoice: enabled }),
}));

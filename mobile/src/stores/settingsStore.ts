import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RoutingProfile } from '../types';

type ThemeMode = 'light' | 'dark' | 'system';
type Units = 'km' | 'miles';

interface SettingsState {
  theme: ThemeMode;
  units: Units;
  defaultProfile: RoutingProfile;
  defaultCityId: string;
  navigationVoice: boolean;
  setTheme: (theme: ThemeMode) => void;
  setUnits: (units: Units) => void;
  setDefaultProfile: (profile: RoutingProfile) => void;
  setDefaultCityId: (cityId: string) => void;
  setNavigationVoice: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      units: 'km',
      defaultProfile: 'foot',
      defaultCityId: 'krakow',
      navigationVoice: true,
      setTheme: (theme) => set({ theme }),
      setUnits: (units) => set({ units }),
      setDefaultProfile: (profile) => set({ defaultProfile: profile }),
      setDefaultCityId: (cityId) => set({ defaultCityId: cityId }),
      setNavigationVoice: (enabled) => set({ navigationVoice: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

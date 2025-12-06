import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSettingsStore.setState({
      theme: 'system',
      units: 'km',
      defaultProfile: 'foot',
      defaultCityId: 'krakow',
      navigationVoice: true,
    });
  });

  it('should have correct default values', () => {
    const state = useSettingsStore.getState();
    expect(state.theme).toBe('system');
    expect(state.units).toBe('km');
    expect(state.defaultProfile).toBe('foot');
    expect(state.defaultCityId).toBe('krakow');
    expect(state.navigationVoice).toBe(true);
  });

  it('should update theme', () => {
    const { setTheme } = useSettingsStore.getState();

    setTheme('dark');

    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should update units', () => {
    const { setUnits } = useSettingsStore.getState();

    setUnits('miles');

    expect(useSettingsStore.getState().units).toBe('miles');
  });

  it('should update default profile', () => {
    const { setDefaultProfile } = useSettingsStore.getState();

    setDefaultProfile('bicycle');

    expect(useSettingsStore.getState().defaultProfile).toBe('bicycle');
  });

  it('should update default city', () => {
    const { setDefaultCityId } = useSettingsStore.getState();

    setDefaultCityId('warszawa');

    expect(useSettingsStore.getState().defaultCityId).toBe('warszawa');
  });

  it('should toggle navigation voice', () => {
    const { setNavigationVoice } = useSettingsStore.getState();

    setNavigationVoice(false);

    expect(useSettingsStore.getState().navigationVoice).toBe(false);
  });
});

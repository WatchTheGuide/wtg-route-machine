import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCityStore } from './cityStore';
import { CITIES } from '../types';

// Mock Capacitor Preferences
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: null }),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('cityStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCityStore.setState({ currentCity: CITIES.krakow });
  });

  it('should have Kraków as default city', () => {
    const { currentCity } = useCityStore.getState();
    expect(currentCity.id).toBe('krakow');
    expect(currentCity.name).toBe('Kraków');
  });

  it('should change city when setCity is called', () => {
    const { setCity } = useCityStore.getState();

    setCity('warszawa');

    const { currentCity } = useCityStore.getState();
    expect(currentCity.id).toBe('warszawa');
    expect(currentCity.name).toBe('Warszawa');
    expect(currentCity.center).toEqual([21.0122, 52.2297]);
  });

  it('should not change city for invalid cityId', () => {
    const { setCity } = useCityStore.getState();

    setCity('nieistniejace-miasto');

    const { currentCity } = useCityStore.getState();
    expect(currentCity.id).toBe('krakow');
  });

  it('should have correct port for each city', () => {
    expect(CITIES.krakow.port).toBe(5001);
    expect(CITIES.warszawa.port).toBe(5002);
    expect(CITIES.wroclaw.port).toBe(5003);
    expect(CITIES.trojmiasto.port).toBe(5004);
  });
});

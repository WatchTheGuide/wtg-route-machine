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

  it('should have correct ports for each city profile', () => {
    // Kraków
    expect(CITIES.krakow.ports.foot).toBe(5001);
    expect(CITIES.krakow.ports.bicycle).toBe(5002);
    expect(CITIES.krakow.ports.car).toBe(5003);
    // Warszawa
    expect(CITIES.warszawa.ports.foot).toBe(5011);
    expect(CITIES.warszawa.ports.bicycle).toBe(5012);
    expect(CITIES.warszawa.ports.car).toBe(5013);
    // Wrocław
    expect(CITIES.wroclaw.ports.foot).toBe(5021);
    expect(CITIES.wroclaw.ports.bicycle).toBe(5022);
    expect(CITIES.wroclaw.ports.car).toBe(5023);
    // Trójmiasto
    expect(CITIES.trojmiasto.ports.foot).toBe(5031);
    expect(CITIES.trojmiasto.ports.bicycle).toBe(5032);
    expect(CITIES.trojmiasto.ports.car).toBe(5033);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMap } from './useMap';

// Mock dla cityStore
vi.mock('../stores/cityStore', () => ({
  useCityStore: vi.fn(() => ({
    currentCity: {
      id: 'krakow',
      name: 'Kraków',
      center: [19.9449, 50.0647] as [number, number],
    },
  })),
}));

describe('useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default center from current city', () => {
    const { result } = renderHook(() => useMap());

    expect(result.current.center).toEqual([19.9449, 50.0647]);
    expect(result.current.zoom).toBe(14);
  });

  it('should allow custom initial zoom', () => {
    const { result } = renderHook(() => useMap(16));

    expect(result.current.zoom).toBe(16);
  });

  it('should update center with setCenter', () => {
    const { result } = renderHook(() => useMap());

    act(() => {
      result.current.setCenter([21.0122, 52.2297]);
    });

    expect(result.current.center).toEqual([21.0122, 52.2297]);
  });

  it('should update zoom with setZoom', () => {
    const { result } = renderHook(() => useMap());

    act(() => {
      result.current.setZoom(18);
    });

    expect(result.current.zoom).toBe(18);
  });

  it('should fly to coordinate', () => {
    const { result } = renderHook(() => useMap());

    act(() => {
      result.current.flyTo([17.0385, 51.1079], 15);
    });

    expect(result.current.center).toEqual([17.0385, 51.1079]);
    expect(result.current.zoom).toBe(15);
  });

  it('should fly to coordinate without changing zoom', () => {
    const { result } = renderHook(() => useMap());

    act(() => {
      result.current.flyTo([17.0385, 51.1079]);
    });

    expect(result.current.center).toEqual([17.0385, 51.1079]);
    expect(result.current.zoom).toBe(14); // Nie zmieniony
  });

  it('should go to current city', () => {
    const { result } = renderHook(() => useMap());

    // Najpierw zmień pozycję
    act(() => {
      result.current.flyTo([21.0122, 52.2297], 18);
    });

    // Wróć do miasta
    act(() => {
      result.current.goToCurrentCity();
    });

    expect(result.current.center).toEqual([19.9449, 50.0647]);
    expect(result.current.zoom).toBe(14);
  });
});

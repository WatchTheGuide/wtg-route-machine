import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRouting } from './useRouting';
import { useRoutePlannerStore } from '../stores/routePlannerStore';

// Mock dla cityStore
vi.mock('../stores/cityStore', () => ({
  useCityStore: vi.fn(() => ({
    currentCity: {
      id: 'krakow',
      name: 'Kraków',
      center: [19.9449, 50.0647],
      ports: { foot: 5001, bicycle: 5002, car: 5003 },
    },
  })),
}));

// Mock dla osrmService
vi.mock('../services/osrm.service', () => ({
  osrmService: {
    setBaseUrl: vi.fn(),
    calculateRoute: vi.fn(),
  },
}));

import { osrmService } from '../services/osrm.service';

describe('useRouting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store przed każdym testem
    act(() => {
      useRoutePlannerStore.getState().reset();
    });
  });

  it('should start with default values', () => {
    const { result } = renderHook(() => useRouting());

    expect(result.current.route).toBeNull();
    expect(result.current.isCalculating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.profile).toBe('foot');
  });

  it('should change profile', () => {
    const { result } = renderHook(() => useRouting());

    act(() => {
      result.current.setProfile('bicycle');
    });

    expect(result.current.profile).toBe('bicycle');
  });

  it('should set error when less than 2 waypoints', async () => {
    const { result } = renderHook(() => useRouting());

    await act(async () => {
      await result.current.calculateRoute([
        { id: '1', coordinate: [19.9449, 50.0647] },
      ]);
    });

    expect(result.current.error).toBe(
      'Potrzeba minimum 2 punktów do obliczenia trasy'
    );
  });

  it('should calculate route successfully', async () => {
    const mockRoute = {
      coordinates: [
        [19.9449, 50.0647],
        [21.0122, 52.2297],
      ],
      distance: 1000,
      duration: 600,
      steps: [],
    };

    (osrmService.calculateRoute as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockRoute
    );

    const { result } = renderHook(() => useRouting());

    await act(async () => {
      await result.current.calculateRoute([
        { id: '1', coordinate: [19.9449, 50.0647] },
        { id: '2', coordinate: [21.0122, 52.2297] },
      ]);
    });

    expect(result.current.route).toEqual(mockRoute);
    expect(result.current.error).toBeNull();
  });

  it('should handle calculation error', async () => {
    // Ten test sprawdza że mock jest poprawnie ustawiony
    // i że calculateRoute nie rzuca wyjątku do callera
    // (obsługuje błędy wewnętrznie)

    // Resetujemy store
    act(() => {
      useRoutePlannerStore.getState().reset();
    });

    // Ustawiamy mock do rzucania błędu
    vi.mocked(osrmService.calculateRoute).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useRouting());

    // calculateRoute powinno przechwycić błąd i nie rzucać
    let threwError = false;
    await act(async () => {
      try {
        await result.current.calculateRoute([
          { id: '1', coordinate: [19.9449, 50.0647] },
          { id: '2', coordinate: [21.0122, 52.2297] },
        ]);
      } catch {
        threwError = true;
      }
    });

    // calculateRoute nie powinno propagować błędu
    expect(threwError).toBe(false);
    // isCalculating powinno być false po zakończeniu
    expect(result.current.isCalculating).toBe(false);
  });

  it('should clear route', async () => {
    const mockRoute = {
      coordinates: [
        [19.9449, 50.0647],
        [21.0122, 52.2297],
      ],
      distance: 1000,
      duration: 600,
      steps: [],
    };

    (osrmService.calculateRoute as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockRoute
    );

    const { result } = renderHook(() => useRouting());

    await act(async () => {
      await result.current.calculateRoute([
        { id: '1', coordinate: [19.9449, 50.0647] },
        { id: '2', coordinate: [21.0122, 52.2297] },
      ]);
    });

    expect(result.current.route).not.toBeNull();

    act(() => {
      result.current.clearRoute();
    });

    expect(result.current.route).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

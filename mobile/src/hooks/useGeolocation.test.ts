import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

// Mock dla @capacitor/geolocation
vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    checkPermissions: vi.fn().mockResolvedValue({ location: 'granted' }),
    requestPermissions: vi.fn().mockResolvedValue({ location: 'granted' }),
    getCurrentPosition: vi.fn().mockResolvedValue({
      coords: {
        latitude: 50.0647,
        longitude: 19.9449,
        accuracy: 10,
      },
    }),
    watchPosition: vi.fn().mockResolvedValue('watch-id-1'),
    clearWatch: vi.fn(),
  },
}));

// Mock dla @capacitor/core
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
  },
}));

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.position).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.accuracy).toBeNull();
  });

  it('should provide getCurrentPosition function', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(typeof result.current.getCurrentPosition).toBe('function');
  });

  it('should provide startWatching function', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(typeof result.current.startWatching).toBe('function');
  });

  it('should provide stopWatching function', () => {
    const { result } = renderHook(() => useGeolocation());

    expect(typeof result.current.stopWatching).toBe('function');
  });

  it('should get current position', async () => {
    const { result } = renderHook(() => useGeolocation());

    let position: [number, number] | null = null;

    await act(async () => {
      position = await result.current.getCurrentPosition();
    });

    await waitFor(() => {
      expect(result.current.position).toEqual([19.9449, 50.0647]);
      expect(result.current.accuracy).toBe(10);
    });

    expect(position).toEqual([19.9449, 50.0647]);
  });

  it('should handle error when getting position fails', async () => {
    const { Geolocation } = await import('@capacitor/geolocation');
    vi.mocked(Geolocation.getCurrentPosition).mockRejectedValueOnce(
      new Error('Location unavailable')
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await result.current.getCurrentPosition();
    });

    expect(result.current.error).toBe('Location unavailable');
    expect(result.current.position).toBeNull();
  });
});

/**
 * Tests for useHistory Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory, HistoryEntry } from './useHistory';
import { Route, Waypoint } from '../types/route.types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useHistory', () => {
  const mockRoute: Route = {
    coordinates: [
      [19.9385, 50.0647],
      [19.94, 50.065],
    ],
    distance: 1000,
    duration: 600,
  };

  const mockWaypoints: Waypoint[] = [
    { id: '1', coordinate: [19.9385, 50.0647], address: 'Point A' },
    { id: '2', coordinate: [19.94, 50.065], address: 'Point B' },
  ];

  const mockEntryData = {
    waypoints: mockWaypoints,
    route: mockRoute,
    profile: 'foot' as const,
    cityId: 'krakow',
    cityName: 'Kraków',
    distance: 1000,
    duration: 600,
  };

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty history', () => {
      const { result } = renderHook(() => useHistory());
      expect(result.current.history).toEqual([]);
    });

    it('should load history from localStorage on mount', () => {
      const existingHistory: HistoryEntry[] = [
        {
          id: 'test-1',
          timestamp: '2024-01-01T12:00:00Z',
          ...mockEntryData,
        },
      ];
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingHistory)
      );

      const { result } = renderHook(() => useHistory());
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].id).toBe('test-1');
    });
  });

  describe('addToHistory', () => {
    it('should add new entry to history', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addToHistory(mockEntryData);
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].cityName).toBe('Kraków');
    });

    it('should generate unique ID for each entry', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addToHistory(mockEntryData);
        result.current.addToHistory(mockEntryData);
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].id).not.toBe(
        result.current.history[1].id
      );
    });

    it('should add new entries at the beginning', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addToHistory({ ...mockEntryData, cityName: 'First' });
      });

      act(() => {
        result.current.addToHistory({ ...mockEntryData, cityName: 'Second' });
      });

      expect(result.current.history[0].cityName).toBe('Second');
      expect(result.current.history[1].cityName).toBe('First');
    });

    it('should limit history to MAX_HISTORY_ITEMS', () => {
      const { result } = renderHook(() => useHistory());

      // Add 25 entries
      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.addToHistory({
            ...mockEntryData,
            cityName: `City ${i}`,
          });
        }
      });

      // Should be limited to 20
      expect(result.current.history.length).toBeLessThanOrEqual(20);
    });

    it('should save to localStorage', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addToHistory(mockEntryData);
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('removeFromHistory', () => {
    it('should remove entry by ID', () => {
      const existingHistory: HistoryEntry[] = [
        { id: 'test-1', timestamp: '2024-01-01T12:00:00Z', ...mockEntryData },
        { id: 'test-2', timestamp: '2024-01-01T13:00:00Z', ...mockEntryData },
      ];
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingHistory)
      );

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.removeFromHistory('test-1');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].id).toBe('test-2');
    });

    it('should do nothing if ID not found', () => {
      const existingHistory: HistoryEntry[] = [
        { id: 'test-1', timestamp: '2024-01-01T12:00:00Z', ...mockEntryData },
      ];
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingHistory)
      );

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.removeFromHistory('non-existent');
      });

      expect(result.current.history).toHaveLength(1);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.addToHistory(mockEntryData);
        result.current.addToHistory(mockEntryData);
      });

      expect(result.current.history.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toEqual([]);
    });

    it('should remove from localStorage', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.clearHistory();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe('getHistoryEntry', () => {
    it('should return entry by ID', () => {
      const existingHistory: HistoryEntry[] = [
        { id: 'test-1', timestamp: '2024-01-01T12:00:00Z', ...mockEntryData },
        {
          id: 'test-2',
          timestamp: '2024-01-01T13:00:00Z',
          ...mockEntryData,
          cityName: 'Warszawa',
        },
      ];
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(existingHistory)
      );

      const { result } = renderHook(() => useHistory());

      const entry = result.current.getHistoryEntry('test-2');
      expect(entry).toBeDefined();
      expect(entry?.cityName).toBe('Warszawa');
    });

    it('should return undefined if not found', () => {
      const { result } = renderHook(() => useHistory());

      const entry = result.current.getHistoryEntry('non-existent');
      expect(entry).toBeUndefined();
    });
  });
});

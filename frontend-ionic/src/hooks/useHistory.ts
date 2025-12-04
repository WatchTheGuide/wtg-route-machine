/**
 * useHistory Hook
 * Manages route history in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Route, Waypoint, RoutingProfile, City } from '../types/route.types';

const HISTORY_STORAGE_KEY = 'guidetrackee_route_history';
const MAX_HISTORY_ITEMS = 20;

export interface HistoryEntry {
  id: string;
  timestamp: string;
  waypoints: Waypoint[];
  route: Route;
  profile: RoutingProfile;
  cityId: string;
  cityName: string;
  distance: number;
  duration: number;
}

export interface UseHistoryReturn {
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryEntry: (id: string) => HistoryEntry | undefined;
}

/**
 * Generate unique ID for history entries
 */
function generateId(): string {
  return `hist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Load history from localStorage
 */
function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
}

/**
 * Save history to localStorage
 */
function saveHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
}

/**
 * Custom hook for managing route history
 */
export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    const loaded = loadHistory();
    setHistory(loaded);
  }, []);

  /**
   * Add a new entry to history
   */
  const addToHistory = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => {
        // Add to beginning, limit to max items
        const updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  /**
   * Remove entry from history by ID
   */
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  /**
   * Get a specific history entry by ID
   */
  const getHistoryEntry = useCallback(
    (id: string): HistoryEntry | undefined => {
      return history.find((entry) => entry.id === id);
    },
    [history]
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryEntry,
  };
}

/**
 * Hook to save route to history when it changes
 */
export function useAutoSaveHistory(
  route: Route | null,
  waypoints: Waypoint[],
  profile: RoutingProfile,
  city: City,
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
): void {
  useEffect(() => {
    // Only save if we have a valid route with at least 2 waypoints
    if (!route || waypoints.length < 2) return;

    // Debounce - don't save immediately on every change
    const timeoutId = setTimeout(() => {
      addToHistory({
        waypoints: [...waypoints],
        route: { ...route },
        profile,
        cityId: city.id,
        cityName: city.name,
        distance: route.distance,
        duration: route.duration,
      });
    }, 2000); // Save 2 seconds after route stabilizes

    return () => clearTimeout(timeoutId);
  }, [route, waypoints, profile, city, addToHistory]);
}

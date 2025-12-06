import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock dla useTheme hook
vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    isDarkMode: false,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

// Mock dla MapView - unikamy inicjalizacji OpenLayers
vi.mock('./components/map', () => ({
  MapView: () => <div data-testid="map-view">Mocked Map</div>,
}));

// Mock dla useMap
vi.mock('./hooks/useMap', () => ({
  useMap: () => ({
    center: [19.9449, 50.0647],
    zoom: 14,
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    flyTo: vi.fn(),
    goToCurrentCity: vi.fn(),
  }),
}));

// Mock dla useGeolocation
vi.mock('./hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    position: null,
    isLoading: false,
    error: null,
    accuracy: null,
    getCurrentPosition: vi.fn(),
    startWatching: vi.fn(),
    stopWatching: vi.fn(),
  }),
}));

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

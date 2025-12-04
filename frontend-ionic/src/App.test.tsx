import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock MapView component since it uses OpenLayers which requires DOM
vi.mock('./components/MapView/MapView', () => ({
  default: () => <div data-testid="map-view-mock">Map View Mock</div>,
}));

// Mock all hooks used by pages
vi.mock('./hooks/useWaypoints', () => ({
  useWaypoints: () => ({
    waypoints: [],
    addWaypoint: vi.fn(),
    removeWaypoint: vi.fn(),
    reorderWaypoints: vi.fn(),
    clearWaypoints: vi.fn(),
  }),
}));

vi.mock('./hooks/useRouting', () => ({
  useRouting: () => ({
    route: null,
    isLoading: false,
    error: null,
    profile: 'foot',
    city: { id: 'krakow', name: 'Kraków', center: [19.9449, 50.0647] },
    calculateRoute: vi.fn(),
    clearRoute: vi.fn(),
    setProfile: vi.fn(),
  }),
}));

vi.mock('./hooks/useExport', () => ({
  useExport: () => ({
    exportGeoJSON: vi.fn(),
    exportPDF: vi.fn(),
    shareRoute: vi.fn(),
  }),
}));

vi.mock('./hooks/useHistory', () => ({
  useHistory: () => ({
    history: [],
    addToHistory: vi.fn(),
    removeFromHistory: vi.fn(),
    clearHistory: vi.fn(),
    getHistoryEntry: vi.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

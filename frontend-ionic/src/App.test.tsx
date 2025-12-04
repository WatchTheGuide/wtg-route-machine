import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock MapView component since it uses OpenLayers which requires DOM
vi.mock('./components/MapView/MapView', () => ({
  default: () => <div data-testid="map-view-mock">Map View Mock</div>,
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

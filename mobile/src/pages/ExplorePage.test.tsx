import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ExplorePage from './ExplorePage';

// Mock dla MapView - unikamy inicjalizacji OpenLayers
vi.mock('../components/map', () => ({
  MapView: ({ className }: { className?: string }) => (
    <div data-testid="map-view" className={className}>
      Mocked Map
    </div>
  ),
}));

// Mock dla useMap
vi.mock('../hooks/useMap', () => ({
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
vi.mock('../hooks/useGeolocation', () => ({
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

// Mock dla cityStore
vi.mock('../stores/cityStore', () => ({
  useCityStore: () => ({
    currentCity: {
      id: 'krakow',
      name: 'Kraków',
      center: [19.9449, 50.0647],
    },
    setCity: vi.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>{component}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

describe('ExplorePage', () => {
  it('should render without crashing', () => {
    const { baseElement } = renderWithRouter(<ExplorePage />);
    expect(baseElement).toBeDefined();
  });

  it('should display page title in header', () => {
    renderWithRouter(<ExplorePage />);
    const titles = screen.getAllByText('Odkrywaj');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should render map view', () => {
    renderWithRouter(<ExplorePage />);
    expect(screen.getByTestId('map-view')).toBeInTheDocument();
  });
});

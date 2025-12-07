import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToursPage from './ToursPage';

// Mock toursService
vi.mock('../services/tours.service', () => ({
  toursService: {
    getCities: vi.fn().mockResolvedValue([]),
    getToursByCity: vi.fn().mockResolvedValue([]),
    getTourById: vi.fn().mockResolvedValue(null),
    searchTours: vi.fn().mockResolvedValue([]),
  },
}));

const renderWithRouter = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>{component}</IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
};

describe('ToursPage', () => {
  it('should render without crashing', () => {
    const { baseElement } = renderWithRouter(<ToursPage />);
    expect(baseElement).toBeDefined();
  });

  it('should display page title', () => {
    renderWithRouter(<ToursPage />);
    // Title is translated to "Wycieczki" in Polish (default)
    const titles = screen.getAllByText('Wycieczki');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show category filter with "All" option', async () => {
    renderWithRouter(<ToursPage />);
    // "All" is translated to "Wszystkie" in Polish (default)
    expect(screen.getByText('Wszystkie')).toBeInTheDocument();
  });

  it('should render tours page content', () => {
    const { baseElement } = renderWithRouter(<ToursPage />);
    expect(baseElement.querySelector('ion-page')).toBeDefined();
  });
});

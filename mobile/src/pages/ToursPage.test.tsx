import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ToursPage from './ToursPage';

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>{component}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

describe('ToursPage', () => {
  it('should render without crashing', () => {
    const { baseElement } = renderWithRouter(<ToursPage />);
    expect(baseElement).toBeDefined();
  });

  it('should display page title', () => {
    renderWithRouter(<ToursPage />);
    const titles = screen.getAllByText('Wycieczki');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show curated tours heading', () => {
    renderWithRouter(<ToursPage />);
    expect(screen.getByText('Kuratorowane wycieczki')).toBeInTheDocument();
  });

  it('should show coming soon message', () => {
    renderWithRouter(<ToursPage />);
    expect(screen.getByText(/Wkrótce dostępne/i)).toBeInTheDocument();
  });
});

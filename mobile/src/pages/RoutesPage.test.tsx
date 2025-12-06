import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RoutesPage from './RoutesPage';

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>{component}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

describe('RoutesPage', () => {
  it('should render without crashing', () => {
    const { baseElement } = renderWithRouter(<RoutesPage />);
    expect(baseElement).toBeDefined();
  });

  it('should display page title', () => {
    renderWithRouter(<RoutesPage />);
    const titles = screen.getAllByText('Moje trasy');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show empty state message', () => {
    renderWithRouter(<RoutesPage />);
    expect(screen.getByText('Brak zapisanych tras')).toBeInTheDocument();
  });

  it('should show instruction for creating routes', () => {
    renderWithRouter(<RoutesPage />);
    expect(screen.getByText(/Zaplanuj trasę w zakładce/i)).toBeInTheDocument();
  });
});

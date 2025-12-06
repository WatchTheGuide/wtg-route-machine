import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ExplorePage from './ExplorePage';

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

  it('should display page title', () => {
    renderWithRouter(<ExplorePage />);
    // Title appears twice (header and large title)
    const titles = screen.getAllByText('Odkrywaj');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show placeholder text', () => {
    renderWithRouter(<ExplorePage />);
    expect(
      screen.getByText(/Mapa z POI pojawi się tutaj/i)
    ).toBeInTheDocument();
  });
});

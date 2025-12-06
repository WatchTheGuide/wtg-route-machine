import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SettingsPage from './SettingsPage';

// Mock dla useTheme hook
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    isDarkMode: false,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
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

describe('SettingsPage', () => {
  it('should render without crashing', () => {
    const { baseElement } = renderWithRouter(<SettingsPage />);
    expect(baseElement).toBeDefined();
  });

  it('should display page title', () => {
    renderWithRouter(<SettingsPage />);
    const titles = screen.getAllByText('Ustawienia');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show default city setting', () => {
    renderWithRouter(<SettingsPage />);
    expect(screen.getByText('Domyślne miasto')).toBeInTheDocument();
    expect(screen.getByText('Kraków')).toBeInTheDocument();
  });

  it('should show dark mode toggle', () => {
    renderWithRouter(<SettingsPage />);
    expect(screen.getByText('Tryb ciemny')).toBeInTheDocument();
  });

  it('should show units setting', () => {
    renderWithRouter(<SettingsPage />);
    expect(screen.getByText('Jednostki')).toBeInTheDocument();
    expect(screen.getByText('Kilometry')).toBeInTheDocument();
  });

  it('should show about section', () => {
    renderWithRouter(<SettingsPage />);
    expect(screen.getByText('O aplikacji')).toBeInTheDocument();
    expect(screen.getByText(/WTG Route Machine/i)).toBeInTheDocument();
  });
});

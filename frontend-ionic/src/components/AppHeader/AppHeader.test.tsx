import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from './AppHeader';

// Mock Ionic components for proper testing
vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    IonHeader: ({ children }: { children: React.ReactNode }) => (
      <header>{children}</header>
    ),
    IonToolbar: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    IonTitle: ({ children }: { children: React.ReactNode }) => (
      <h1>{children}</h1>
    ),
    IonButtons: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    IonButton: ({
      children,
      onClick,
      'aria-label': ariaLabel,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      'aria-label'?: string;
    }) => (
      <button onClick={onClick} aria-label={ariaLabel}>
        {children}
      </button>
    ),
    IonIcon: () => <span data-testid="ion-icon" />,
  };
});

describe('AppHeader', () => {
  it('renders the app title', () => {
    render(<AppHeader isDarkMode={false} onToggleTheme={() => {}} />);

    expect(screen.getByText('GuideTrackee Routes')).toBeInTheDocument();
    expect(screen.getByText('City Walking Tours')).toBeInTheDocument();
  });

  it('calls onToggleTheme when theme button is clicked', () => {
    const onToggleTheme = vi.fn();
    render(<AppHeader isDarkMode={false} onToggleTheme={onToggleTheme} />);

    const themeButton = screen.getByRole('button', {
      name: /switch to dark mode/i,
    });
    fireEvent.click(themeButton);

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows correct aria-label based on dark mode state', () => {
    const { rerender } = render(
      <AppHeader isDarkMode={false} onToggleTheme={() => {}} />
    );

    expect(
      screen.getByRole('button', { name: /switch to dark mode/i })
    ).toBeInTheDocument();

    rerender(<AppHeader isDarkMode={true} onToggleTheme={() => {}} />);

    expect(
      screen.getByRole('button', { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });
});

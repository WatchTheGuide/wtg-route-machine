/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteInfo from './RouteInfo';
import { Route } from '../../types/route.types';

// Mock Ionic components
vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    IonCard: ({ children, className }: any) => (
      <div data-testid="ion-card" className={className}>
        {children}
      </div>
    ),
    IonCardContent: ({ children }: any) => <div>{children}</div>,
    IonIcon: () => <span data-testid="ion-icon" />,
    IonText: ({ children }: any) => <span>{children}</span>,
  };
});

describe('RouteInfo', () => {
  const mockRoute: Route = {
    distance: 5250, // 5.25 km
    duration: 3780, // 63 minutes
    geometry: 'encoded_polyline',
    legs: [],
  };

  it('returns null when no route is provided', () => {
    const { container } = render(<RouteInfo route={null} profile="foot" />);
    expect(container.firstChild).toBeNull();
  });

  it('displays formatted distance in kilometers', () => {
    render(<RouteInfo route={mockRoute} profile="foot" />);
    expect(screen.getByText('5.25 km')).toBeInTheDocument();
  });

  it('displays distance in meters when less than 1km', () => {
    const shortRoute: Route = {
      ...mockRoute,
      distance: 450,
    };
    render(<RouteInfo route={shortRoute} profile="foot" />);
    expect(screen.getByText('450 m')).toBeInTheDocument();
  });

  it('displays formatted duration with hours and minutes', () => {
    render(<RouteInfo route={mockRoute} profile="foot" />);
    expect(screen.getByText('1 godz. 3 min')).toBeInTheDocument();
  });

  it('displays duration in minutes only when less than 1 hour', () => {
    const shortRoute: Route = {
      ...mockRoute,
      duration: 1200, // 20 minutes
    };
    render(<RouteInfo route={shortRoute} profile="foot" />);
    expect(screen.getByText('20 min')).toBeInTheDocument();
  });

  it('shows correct profile label for foot', () => {
    render(<RouteInfo route={mockRoute} profile="foot" />);
    expect(screen.getByText('Czas pieszo')).toBeInTheDocument();
  });

  it('shows correct profile label for bicycle', () => {
    render(<RouteInfo route={mockRoute} profile="bicycle" />);
    expect(screen.getByText('Czas rowerem')).toBeInTheDocument();
  });

  it('shows correct profile label for car', () => {
    render(<RouteInfo route={mockRoute} profile="car" />);
    expect(screen.getByText('Czas samochodem')).toBeInTheDocument();
  });

  it('calculates and displays average speed', () => {
    render(<RouteInfo route={mockRoute} profile="foot" />);
    // 5.25 km / 1.05 hours = ~5.0 km/h
    expect(screen.getByText('5.0 km/h')).toBeInTheDocument();
  });
});

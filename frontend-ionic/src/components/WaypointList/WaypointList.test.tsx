import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WaypointList from './WaypointList';
import { Waypoint } from '../../types/route.types';

// Mock Ionic components
vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    IonList: ({ children, className }: any) => (
      <div data-testid="ion-list" className={className}>
        {children}
      </div>
    ),
    IonListHeader: ({ children }: any) => (
      <div data-testid="ion-list-header">{children}</div>
    ),
    IonLabel: ({ children }: any) => <div>{children}</div>,
    IonReorderGroup: ({ children, onIonItemReorder }: any) => (
      <div data-testid="ion-reorder-group">{children}</div>
    ),
    IonText: ({ children }: any) => <span>{children}</span>,
    IonIcon: () => <span data-testid="ion-icon" />,
  };
});

// Mock WaypointItem
vi.mock('../WaypointItem', () => ({
  default: ({ waypoint, onRemove }: any) => (
    <div data-testid={`waypoint-${waypoint.id}`}>
      <span>{waypoint.address || `Point ${waypoint.order}`}</span>
      <button onClick={() => onRemove(waypoint.id)}>Remove</button>
    </div>
  ),
}));

describe('WaypointList', () => {
  const mockWaypoints: Waypoint[] = [
    {
      id: '1',
      coordinate: { lon: 19.9385, lat: 50.0647 },
      address: 'Rynek Główny',
      order: 1,
    },
    {
      id: '2',
      coordinate: { lon: 19.945, lat: 50.06 },
      address: 'Wawel',
      order: 2,
    },
  ];

  it('shows empty state when no waypoints', () => {
    render(
      <WaypointList waypoints={[]} onReorder={() => {}} onRemove={() => {}} />
    );

    expect(
      screen.getByText('Kliknij na mapę, aby dodać punkty trasy')
    ).toBeInTheDocument();
  });

  it('renders waypoints when provided', () => {
    render(
      <WaypointList
        waypoints={mockWaypoints}
        onReorder={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByTestId('waypoint-1')).toBeInTheDocument();
    expect(screen.getByTestId('waypoint-2')).toBeInTheDocument();
  });

  it('displays correct count for single waypoint', () => {
    render(
      <WaypointList
        waypoints={[mockWaypoints[0]]}
        onReorder={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByText('1 punkt')).toBeInTheDocument();
  });

  it('displays correct count for 2-4 waypoints', () => {
    render(
      <WaypointList
        waypoints={mockWaypoints}
        onReorder={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByText('2 punkty')).toBeInTheDocument();
  });

  it('displays correct count for 5+ waypoints', () => {
    const manyWaypoints = Array.from({ length: 5 }, (_, i) => ({
      id: String(i + 1),
      coordinate: { lon: 19.9385 + i * 0.01, lat: 50.0647 },
      order: i + 1,
    }));

    render(
      <WaypointList
        waypoints={manyWaypoints}
        onReorder={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByText('5 punktów')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <WaypointList
        waypoints={mockWaypoints}
        onReorder={() => {}}
        onRemove={onRemove}
      />
    );

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(onRemove).toHaveBeenCalledWith('1');
  });
});

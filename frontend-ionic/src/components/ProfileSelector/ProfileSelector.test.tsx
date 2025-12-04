import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileSelector from './ProfileSelector';
import { RoutingProfile } from '../../types/route.types';

// Mock Ionic components
vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    IonSegment: ({ value, onIonChange, children, ...props }: any) => (
      <div data-testid="ion-segment" data-value={value} {...props}>
        {children}
      </div>
    ),
    IonSegmentButton: ({ value, children, onClick, ...props }: any) => (
      <button
        data-testid={`segment-${value}`}
        onClick={() => onClick?.({ detail: { value } })}
        {...props}>
        {children}
      </button>
    ),
    IonIcon: ({ icon }: any) => <span data-testid="ion-icon" />,
    IonLabel: ({ children }: any) => <span>{children}</span>,
  };
});

describe('ProfileSelector', () => {
  it('renders all three profile options', () => {
    render(
      <ProfileSelector currentProfile="foot" onProfileChange={() => {}} />
    );

    expect(screen.getByText('Pieszo')).toBeInTheDocument();
    expect(screen.getByText('Rower')).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  it('shows the correct current profile', () => {
    render(
      <ProfileSelector currentProfile="bicycle" onProfileChange={() => {}} />
    );

    const segment = screen.getByTestId('ion-segment');
    expect(segment).toHaveAttribute('data-value', 'bicycle');
  });

  it('can be disabled', () => {
    render(
      <ProfileSelector
        currentProfile="foot"
        onProfileChange={() => {}}
        disabled={true}
      />
    );

    const segment = screen.getByTestId('ion-segment');
    expect(segment).toHaveAttribute('disabled');
  });
});

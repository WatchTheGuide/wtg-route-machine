import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import POICard from './POICard';
import { POI } from '../../types';

// Mock Ionic components
vi.mock('@ionic/react', () => ({
  IonModal: ({
    children,
    isOpen,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDidDismiss,
    ...props
  }: React.PropsWithChildren<{
    isOpen: boolean;
    onDidDismiss: () => void;
  }>) =>
    isOpen ? (
      <div data-testid="poi-card-modal" {...props}>
        {children}
      </div>
    ) : null,
  IonHeader: ({ children }: React.PropsWithChildren<object>) => (
    <header>{children}</header>
  ),
  IonToolbar: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  IonTitle: ({ children }: React.PropsWithChildren<object>) => (
    <h1>{children}</h1>
  ),
  IonContent: ({ children }: React.PropsWithChildren<object>) => (
    <main>{children}</main>
  ),
  IonButton: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IonButtons: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  IonIcon: () => <span data-testid="icon" />,
  IonCard: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  IonCardHeader: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  IonCardTitle: ({ children }: React.PropsWithChildren<object>) => (
    <h2>{children}</h2>
  ),
  IonCardSubtitle: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
  IonCardContent: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  IonChip: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
  IonLabel: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
  IonImg: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const mockPOI: POI = {
  id: 'test-poi',
  name: 'Test POI',
  description: 'This is a test POI',
  category: 'landmark',
  coordinate: [19.9, 50.0],
  address: 'ul. Testowa 1, Kraków',
};

describe('POICard', () => {
  it('should not render when poi is null', () => {
    const { queryByTestId } = render(
      <POICard poi={null} isOpen={true} onClose={() => {}} />
    );

    expect(queryByTestId('poi-card-modal')).toBeNull();
  });

  it('should not render when isOpen is false', () => {
    const { queryByTestId } = render(
      <POICard poi={mockPOI} isOpen={false} onClose={() => {}} />
    );

    expect(queryByTestId('poi-card-modal')).toBeNull();
  });

  it('should render modal when poi and isOpen are provided', () => {
    const { getByTestId, getAllByText, getByText } = render(
      <POICard poi={mockPOI} isOpen={true} onClose={() => {}} />
    );

    expect(getByTestId('poi-card-modal')).toBeDefined();
    // Nazwa POI pojawia się w tytule i w karcie
    expect(getAllByText('Test POI').length).toBeGreaterThanOrEqual(1);
    expect(getByText('This is a test POI')).toBeDefined();
  });

  it('should show navigate button when onNavigate is provided', () => {
    const onNavigate = vi.fn();
    const { getByText } = render(
      <POICard
        poi={mockPOI}
        isOpen={true}
        onClose={() => {}}
        onNavigate={onNavigate}
      />
    );

    const navigateButton = getByText('Nawiguj');
    expect(navigateButton).toBeDefined();

    fireEvent.click(navigateButton);
    expect(onNavigate).toHaveBeenCalledWith(mockPOI);
  });

  it('should show add to route button when onAddToRoute is provided', () => {
    const onAddToRoute = vi.fn();
    const { getByText } = render(
      <POICard
        poi={mockPOI}
        isOpen={true}
        onClose={() => {}}
        onAddToRoute={onAddToRoute}
      />
    );

    const addButton = getByText('Dodaj do trasy');
    expect(addButton).toBeDefined();

    fireEvent.click(addButton);
    expect(onAddToRoute).toHaveBeenCalledWith(mockPOI);
  });
});

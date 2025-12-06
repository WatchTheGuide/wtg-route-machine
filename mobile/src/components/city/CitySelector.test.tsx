import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CitySelector from './CitySelector';
import { useCityStore } from '../../stores/cityStore';
import { CITIES } from '../../types';

// Mock Ionic components
vi.mock('@ionic/react', () => ({
  IonActionSheet: ({
    isOpen,
    buttons,
    onDidDismiss,
  }: {
    isOpen: boolean;
    buttons: Array<{ text: string; handler?: () => void }>;
    onDidDismiss: () => void;
  }) =>
    isOpen ? (
      <div data-testid="action-sheet">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              btn.handler?.();
              onDidDismiss();
            }}>
            {btn.text}
          </button>
        ))}
      </div>
    ) : null,
  IonButton: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IonIcon: () => <span data-testid="icon" />,
}));

describe('CitySelector', () => {
  beforeEach(() => {
    // Reset store to default city
    useCityStore.setState({ currentCity: CITIES.krakow });
  });

  it('should render button with current city name', () => {
    const { getByTestId } = render(<CitySelector />);

    const button = getByTestId('city-selector');
    expect(button.textContent).toContain('Kraków');
  });

  it('should render compact button when compact prop is true', () => {
    const { getByTestId, queryByText } = render(<CitySelector compact />);

    expect(getByTestId('city-selector-compact')).toBeDefined();
    expect(queryByText('Kraków')).toBeNull();
  });

  it('should open action sheet on button click', async () => {
    const { getByTestId } = render(<CitySelector />);

    fireEvent.click(getByTestId('city-selector'));

    await waitFor(() => {
      expect(getByTestId('action-sheet')).toBeDefined();
    });
  });

  it('should show action sheet with cities on button click', async () => {
    const { getByTestId } = render(<CitySelector />);

    fireEvent.click(getByTestId('city-selector'));

    await waitFor(() => {
      const actionSheet = getByTestId('action-sheet');
      expect(actionSheet).toBeDefined();
      // 4 miasta + Anuluj = 5 przycisków
      const buttons = actionSheet.querySelectorAll('button');
      expect(buttons.length).toBe(5);
    });
  });

  it('should change city on selection', async () => {
    const { getByTestId, getByText } = render(<CitySelector />);

    fireEvent.click(getByTestId('city-selector'));

    await waitFor(() => {
      fireEvent.click(getByText('Warszawa'));
    });

    expect(useCityStore.getState().currentCity.id).toBe('warszawa');
  });

  it('should call onCityChange callback', async () => {
    const onCityChange = vi.fn();
    const { getByTestId, getByText } = render(
      <CitySelector onCityChange={onCityChange} />
    );

    fireEvent.click(getByTestId('city-selector'));

    await waitFor(() => {
      fireEvent.click(getByText('Wrocław'));
    });

    expect(onCityChange).toHaveBeenCalledWith(CITIES.wroclaw);
  });

  it('should update button text after city change', async () => {
    const { getByTestId, getByText, rerender } = render(<CitySelector />);

    fireEvent.click(getByTestId('city-selector'));

    await waitFor(() => {
      fireEvent.click(getByText('Trójmiasto'));
    });

    // Re-render to see updated state
    rerender(<CitySelector />);

    expect(getByTestId('city-selector').textContent).toContain('Trójmiasto');
  });
});

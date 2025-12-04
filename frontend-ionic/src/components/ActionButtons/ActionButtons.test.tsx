import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from './ActionButtons';

// Mock Ionic components
vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    IonFab: ({ children, className }: any) => (
      <div data-testid="ion-fab" className={className}>
        {children}
      </div>
    ),
    IonFabButton: ({
      children,
      onClick,
      disabled,
      'aria-label': ariaLabel,
    }: any) => (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid={`fab-button-${ariaLabel
          ?.toLowerCase()
          .replace(/\s+/g, '-')}`}>
        {children}
      </button>
    ),
    IonFabList: ({ children }: any) => (
      <div data-testid="ion-fab-list">{children}</div>
    ),
    IonIcon: () => <span data-testid="ion-icon" />,
  };
});

describe('ActionButtons', () => {
  const defaultProps = {
    hasWaypoints: true,
    hasRoute: true,
    onClearAll: vi.fn(),
    onExportGeoJSON: vi.fn(),
    onExportPDF: vi.fn(),
    onLocateMe: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders locate me button', () => {
    render(<ActionButtons {...defaultProps} />);

    const locateButton = screen.getByTestId(
      'fab-button-znajdź-moją-lokalizację'
    );
    expect(locateButton).toBeInTheDocument();
  });

  it('calls onLocateMe when locate button is clicked', () => {
    render(<ActionButtons {...defaultProps} />);

    const locateButton = screen.getByTestId(
      'fab-button-znajdź-moją-lokalizację'
    );
    fireEvent.click(locateButton);

    expect(defaultProps.onLocateMe).toHaveBeenCalledTimes(1);
  });

  it('disables clear button when no waypoints', () => {
    render(<ActionButtons {...defaultProps} hasWaypoints={false} />);

    const clearButton = screen.getByTestId('fab-button-wyczyść-wszystko');
    expect(clearButton).toBeDisabled();
  });

  it('enables clear button when waypoints exist', () => {
    render(<ActionButtons {...defaultProps} hasWaypoints={true} />);

    const clearButton = screen.getByTestId('fab-button-wyczyść-wszystko');
    expect(clearButton).not.toBeDisabled();
  });

  it('disables export buttons when no route', () => {
    render(<ActionButtons {...defaultProps} hasRoute={false} />);

    const geoJsonButton = screen.getByTestId('fab-button-eksportuj-geojson');
    const pdfButton = screen.getByTestId('fab-button-eksportuj-pdf');

    expect(geoJsonButton).toBeDisabled();
    expect(pdfButton).toBeDisabled();
  });

  it('calls onClearAll when clear button is clicked', () => {
    render(<ActionButtons {...defaultProps} />);

    const clearButton = screen.getByTestId('fab-button-wyczyść-wszystko');
    fireEvent.click(clearButton);

    expect(defaultProps.onClearAll).toHaveBeenCalledTimes(1);
  });

  it('calls onExportGeoJSON when export button is clicked', () => {
    render(<ActionButtons {...defaultProps} />);

    const exportButton = screen.getByTestId('fab-button-eksportuj-geojson');
    fireEvent.click(exportButton);

    expect(defaultProps.onExportGeoJSON).toHaveBeenCalledTimes(1);
  });

  it('calls onExportPDF when PDF button is clicked', () => {
    render(<ActionButtons {...defaultProps} />);

    const pdfButton = screen.getByTestId('fab-button-eksportuj-pdf');
    fireEvent.click(pdfButton);

    expect(defaultProps.onExportPDF).toHaveBeenCalledTimes(1);
  });

  it('renders share button when onShare is provided', () => {
    const onShare = vi.fn();
    render(<ActionButtons {...defaultProps} onShare={onShare} />);

    const shareButton = screen.getByTestId('fab-button-udostępnij');
    expect(shareButton).toBeInTheDocument();
  });

  it('does not render share button when onShare is not provided', () => {
    render(<ActionButtons {...defaultProps} />);

    const shareButton = screen.queryByTestId('fab-button-udostępnij');
    expect(shareButton).not.toBeInTheDocument();
  });
});

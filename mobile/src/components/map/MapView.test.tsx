import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import MapView from './MapView';

// Mock dla OpenLayers - komponent wymaga DOM
vi.mock('ol/Map', () => ({
  default: vi.fn().mockImplementation(() => ({
    setTarget: vi.fn(),
    getView: vi.fn().mockReturnValue({
      animate: vi.fn(),
    }),
    on: vi.fn(),
    getTargetElement: vi.fn().mockReturnValue({
      style: {},
    }),
    hasFeatureAtPixel: vi.fn().mockReturnValue(false),
    forEachFeatureAtPixel: vi.fn(),
  })),
}));

vi.mock('ol/View', () => ({
  default: vi.fn(),
}));

vi.mock('ol/layer/Tile', () => ({
  default: vi.fn(),
}));

vi.mock('ol/layer/Vector', () => ({
  default: vi.fn().mockImplementation(() => ({
    getSource: vi.fn().mockReturnValue({
      clear: vi.fn(),
      addFeature: vi.fn(),
    }),
  })),
}));

vi.mock('ol/source/Vector', () => ({
  default: vi.fn(),
}));

vi.mock('ol/source/OSM', () => ({
  default: vi.fn(),
}));

vi.mock('ol/proj', () => ({
  fromLonLat: vi.fn((coord) => coord),
  toLonLat: vi.fn((coord) => coord),
}));

vi.mock('ol/Feature', () => ({
  Feature: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
    setGeometry: vi.fn(),
  })),
}));

vi.mock('ol/geom', () => ({
  Point: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
  LineString: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
}));

vi.mock('ol/style', () => ({
  Style: vi.fn(),
  Stroke: vi.fn(),
  Fill: vi.fn(),
  Circle: vi.fn(),
}));

describe('MapView', () => {
  it('should render map container', () => {
    const { getByTestId } = render(<MapView />);

    expect(getByTestId('map-view')).toBeDefined();
  });

  it('should have map-view class', () => {
    const { getByTestId } = render(<MapView />);

    expect(getByTestId('map-view').classList.contains('map-view')).toBe(true);
  });

  it('should accept custom className', () => {
    const { getByTestId } = render(<MapView className="custom-map" />);

    expect(getByTestId('map-view').classList.contains('custom-map')).toBe(true);
  });

  it('should render with default center (Kraków)', () => {
    const { getByTestId } = render(<MapView />);

    expect(getByTestId('map-view')).toBeDefined();
  });

  it('should accept center prop', () => {
    const center: [number, number] = [21.0122, 52.2297];
    const { getByTestId } = render(<MapView center={center} />);

    expect(getByTestId('map-view')).toBeDefined();
  });

  it('should accept zoom prop', () => {
    const { getByTestId } = render(<MapView zoom={16} />);

    expect(getByTestId('map-view')).toBeDefined();
  });
});

/**
 * CitySelector Component Tests
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CitySelector from './CitySelector';
import { CITIES, DEFAULT_CITY } from '../../types/route.types';

describe('CitySelector', () => {
  const mockOnCityChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render city selector', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
        />
      );

      const wrapper = container.querySelector('.city-selector-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render location icon', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
        />
      );

      const icon = container.querySelector('ion-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render select element', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
        />
      );

      const select = container.querySelector('ion-select');
      expect(select).toBeInTheDocument();
    });
  });

  describe('city selection', () => {
    it('should have correct current value', () => {
      const { container } = render(
        <CitySelector currentCity="warszawa" onCityChange={mockOnCityChange} />
      );

      const select = container.querySelector('ion-select');
      expect(select).toHaveAttribute('value', 'warszawa');
    });

    it('should render all city options', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
        />
      );

      const options = container.querySelectorAll('ion-select-option');
      expect(options.length).toBe(CITIES.length);
    });
  });

  describe('disabled state', () => {
    it('should accept disabled prop', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
          disabled={true}
        />
      );

      const select = container.querySelector('ion-select');
      expect(select).toBeInTheDocument();
    });

    it('should work without disabled prop', () => {
      const { container } = render(
        <CitySelector
          currentCity={DEFAULT_CITY.id}
          onCityChange={mockOnCityChange}
        />
      );

      const select = container.querySelector('ion-select');
      expect(select).toBeInTheDocument();
    });
  });

  describe('all cities available', () => {
    it('should include Kraków', () => {
      const krakow = CITIES.find((c) => c.id === 'krakow');
      expect(krakow).toBeDefined();
      expect(krakow?.name).toBe('Kraków');
    });

    it('should include Warszawa', () => {
      const warszawa = CITIES.find((c) => c.id === 'warszawa');
      expect(warszawa).toBeDefined();
      expect(warszawa?.name).toBe('Warszawa');
    });

    it('should include Wrocław', () => {
      const wroclaw = CITIES.find((c) => c.id === 'wroclaw');
      expect(wroclaw).toBeDefined();
      expect(wroclaw?.name).toBe('Wrocław');
    });

    it('should include Trójmiasto', () => {
      const trojmiasto = CITIES.find((c) => c.id === 'trojmiasto');
      expect(trojmiasto).toBeDefined();
      expect(trojmiasto?.name).toBe('Trójmiasto');
    });
  });
});

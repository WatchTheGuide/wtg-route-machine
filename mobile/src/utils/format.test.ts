import { describe, it, expect } from 'vitest';
import {
  formatDistance,
  formatDuration,
  formatDate,
  getLocalizedString,
} from './format';

describe('formatDistance', () => {
  it('should format meters less than 1000', () => {
    expect(formatDistance(500)).toBe('500 m');
    expect(formatDistance(999)).toBe('999 m');
  });

  it('should format kilometers', () => {
    expect(formatDistance(1000)).toBe('1.0 km');
    expect(formatDistance(1500)).toBe('1.5 km');
    expect(formatDistance(2345)).toBe('2.3 km');
  });
});

describe('formatDuration', () => {
  it('should format minutes only', () => {
    expect(formatDuration(60)).toBe('1min');
    expect(formatDuration(1800)).toBe('30min');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(3600)).toBe('1h 0min');
    expect(formatDuration(5400)).toBe('1h 30min');
    expect(formatDuration(7200)).toBe('2h 0min');
  });

  it('should format with translation function', () => {
    const t = (key: string) => {
      const translations: Record<string, string> = {
        'route.hours': 'godz.',
        'route.minutes': 'min',
      };
      return translations[key] || key;
    };

    expect(formatDuration(3600, t)).toBe('1 godz. 0 min');
    expect(formatDuration(5400, t)).toBe('1 godz. 30 min');
    expect(formatDuration(1800, t)).toBe('30 min');
  });
});

describe('formatDate', () => {
  it('should format date in Polish locale', () => {
    const dateString = '2024-01-15T10:30:00Z';
    const formatted = formatDate(dateString);
    expect(formatted).toMatch(/15/);
    expect(formatted).toMatch(/2024/);
  });
});

describe('getLocalizedString', () => {
  const testString = {
    pl: 'Kraków',
    en: 'Krakow',
    de: 'Krakau',
    fr: 'Cracovie',
    uk: 'Краків',
  };

  it('should return Polish by default', () => {
    expect(getLocalizedString(testString)).toBe('Kraków');
  });

  it('should return correct language when specified', () => {
    expect(getLocalizedString(testString, 'en')).toBe('Krakow');
    expect(getLocalizedString(testString, 'de')).toBe('Krakau');
    expect(getLocalizedString(testString, 'fr')).toBe('Cracovie');
    expect(getLocalizedString(testString, 'uk')).toBe('Краків');
  });

  it('should handle case-insensitive language codes', () => {
    expect(getLocalizedString(testString, 'EN')).toBe('Krakow');
    expect(getLocalizedString(testString, 'De')).toBe('Krakau');
  });

  it('should fallback to Polish for unsupported languages', () => {
    expect(getLocalizedString(testString, 'es')).toBe('Kraków');
    expect(getLocalizedString(testString, 'it')).toBe('Kraków');
  });
});

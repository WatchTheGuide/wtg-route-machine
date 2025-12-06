import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';
import { useSettingsStore } from '../stores/settingsStore';

// Mock dla @capacitor/status-bar
vi.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setStyle: vi.fn(),
    setBackgroundColor: vi.fn(),
  },
  Style: {
    Light: 'LIGHT',
    Dark: 'DARK',
  },
}));

// Mock dla @capacitor/core
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
  },
}));

// Mock dla zustand store
vi.mock('../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
}));

describe('useTheme', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock matchMedia
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    // Wyczyść klasę 'dark' z body przed każdym testem
    document.body.classList.remove('dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return theme state', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.isDarkMode).toBe(false);
  });

  it('should provide setTheme function', () => {
    const { result } = renderHook(() => useTheme());

    expect(typeof result.current.setTheme).toBe('function');
  });

  it('should provide toggleTheme function', () => {
    const { result } = renderHook(() => useTheme());

    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should add dark class to body when dark mode is applied', async () => {
    const mockSetTheme = vi.fn();
    vi.mocked(useSettingsStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      units: 'km',
      defaultProfile: 'foot',
      defaultCityId: 'krakow',
      navigationVoice: true,
      setUnits: vi.fn(),
      setDefaultProfile: vi.fn(),
      setDefaultCityId: vi.fn(),
      setNavigationVoice: vi.fn(),
    });

    renderHook(() => useTheme());

    // Po renderowaniu z theme: 'dark', klasa powinna być dodana
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from body when light mode is applied', async () => {
    // Najpierw dodaj klasę dark
    document.body.classList.add('dark');

    vi.mocked(useSettingsStore).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      units: 'km',
      defaultProfile: 'foot',
      defaultCityId: 'krakow',
      navigationVoice: true,
      setUnits: vi.fn(),
      setDefaultProfile: vi.fn(),
      setDefaultCityId: vi.fn(),
      setNavigationVoice: vi.fn(),
    });

    renderHook(() => useTheme());

    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('should respect system preference when theme is set to system', async () => {
    // Mock system dark mode preference
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    vi.mocked(useSettingsStore).mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
      units: 'km',
      defaultProfile: 'foot',
      defaultCityId: 'krakow',
      navigationVoice: true,
      setUnits: vi.fn(),
      setDefaultProfile: vi.fn(),
      setDefaultCityId: vi.fn(),
      setNavigationVoice: vi.fn(),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDarkMode).toBe(true);
  });
});

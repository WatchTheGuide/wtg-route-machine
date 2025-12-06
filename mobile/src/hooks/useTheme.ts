import { useEffect, useCallback } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Hook do zarządzania motywem aplikacji (jasny/ciemny/systemowy)
 */
export const useTheme = () => {
  const { theme, setTheme } = useSettingsStore();

  /**
   * Aktualizuje StatusBar na natywnych platformach
   */
  const updateStatusBar = useCallback(async (isDark: boolean) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        // Tło zawsze pomarańczowe
        await StatusBar.setBackgroundColor({ color: '#ff6600' });
      } catch (error) {
        console.error('Failed to update status bar:', error);
      }
    }
  }, []);

  /**
   * Aplikuje motyw do DOM
   */
  const applyTheme = useCallback(
    (themeMode: 'light' | 'dark' | 'system') => {
      let isDark = false;

      if (themeMode === 'system') {
        // Sprawdź preferencje systemowe
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }

      // Dodaj/usuń klasę 'dark' na body
      document.body.classList.toggle('dark', isDark);

      // Aktualizuj StatusBar
      updateStatusBar(isDark);
    },
    [updateStatusBar]
  );

  /**
   * Przełącza między jasnym a ciemnym motywem
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [theme, setTheme, applyTheme]);

  /**
   * Sprawdza czy aktualnie jest aktywny ciemny motyw
   */
  const isDarkMode = useCallback(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  // Nasłuchuj zmian preferencji systemowych
  useEffect(() => {
    // Zastosuj motyw przy pierwszym renderowaniu
    applyTheme(theme);

    // Nasłuchuj zmian w preferencjach systemowych
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme: (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
      applyTheme(newTheme);
    },
    toggleTheme,
    isDarkMode: isDarkMode(),
  };
};

/**
 * WTG Route Machine - Theme Management
 * Handles dark/light mode switching with localStorage persistence
 */

(function () {
  const THEME_KEY = 'wtg-theme';
  const DARK_CLASS = 'dark';

  /**
   * Get current theme from localStorage or system preference
   */
  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to HTML element
   */
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add(DARK_CLASS);
    } else {
      html.classList.remove(DARK_CLASS);
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    updateToggleButton(next);
  }

  /**
   * Update toggle button appearance
   */
  function updateToggleButton(theme) {
    const sunIcon = document.getElementById('theme-sun');
    const moonIcon = document.getElementById('theme-moon');

    if (!sunIcon || !moonIcon) return;

    if (theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
    updateToggleButton(theme);

    // Setup toggle button click handler
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
            updateToggleButton(e.matches ? 'dark' : 'light');
          }
        });
    }
  }

  // Export to window object
  window.wtgTheme = {
    toggle: toggleTheme,
    apply: applyTheme,
    get: getTheme,
    init: initTheme,
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

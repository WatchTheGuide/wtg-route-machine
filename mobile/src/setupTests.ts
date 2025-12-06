// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './i18n/locales/pl';

// Initialize i18n for tests with Polish as default language
i18n.use(initReactI18next).init({
  lng: 'pl',
  fallbackLng: 'pl',
  resources: {
    pl: pl,
  },
  interpolation: {
    escapeValue: false,
  },
});

// Mock matchmedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock ResizeObserver dla OpenLayers
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

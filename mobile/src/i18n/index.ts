import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Preferences } from '@capacitor/preferences';

// Import translations
import pl from './locales/pl';
import en from './locales/en';
import de from './locales/de';
import fr from './locales/fr';
import uk from './locales/uk';

// Custom language detector for Capacitor
const capacitorLanguageDetector = {
  name: 'capacitorPreferences',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const { value } = await Preferences.get({ key: 'language' });
      if (value) {
        callback(value);
        return;
      }
    } catch {
      // Fall through to browser detection
    }
    // Use browser language as fallback
    const browserLang = navigator.language.split('-')[0];
    callback(browserLang);
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await Preferences.set({ key: 'language', value: lng });
    } catch {
      // Ignore errors
    }
  },
};

// Available languages
export const LANGUAGES = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl,
      en,
      de,
      fr,
      uk,
    },
    fallbackLng: 'pl',
    supportedLngs: ['pl', 'en', 'de', 'fr', 'uk'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['capacitorPreferences', 'navigator', 'htmlTag'],
      caches: [],
    },
  });

// Add custom detector
const languageDetector = i18n.services.languageDetector as {
  addDetector: (detector: typeof capacitorLanguageDetector) => void;
};
languageDetector.addDetector(capacitorLanguageDetector);

export default i18n;

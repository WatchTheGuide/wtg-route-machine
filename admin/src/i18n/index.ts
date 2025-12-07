import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import pl from './locales/pl';
import en from './locales/en';
import de from './locales/de';
import fr from './locales/fr';
import uk from './locales/uk';

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
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  });

export default i18n;

import { describe, it, expect } from 'vitest';
import i18n, { LANGUAGES, type LanguageCode } from '@/i18n';

describe('i18n configuration', () => {
  describe('LANGUAGES constant', () => {
    it('should have 5 supported languages', () => {
      expect(LANGUAGES).toHaveLength(5);
    });

    it('should include Polish as first language', () => {
      expect(LANGUAGES[0]).toEqual({
        code: 'pl',
        name: 'Polski',
        flag: '🇵🇱',
      });
    });

    it('should include all required languages', () => {
      const codes = LANGUAGES.map((lang) => lang.code);
      expect(codes).toContain('pl');
      expect(codes).toContain('en');
      expect(codes).toContain('de');
      expect(codes).toContain('fr');
      expect(codes).toContain('uk');
    });

    it('should have flag emoji for each language', () => {
      LANGUAGES.forEach((lang) => {
        expect(lang.flag).toBeTruthy();
        expect(lang.flag.length).toBeGreaterThan(0);
      });
    });
  });

  describe('i18n instance', () => {
    it('should be initialized', () => {
      expect(i18n.isInitialized).toBe(true);
    });

    it('should have Polish as fallback language', () => {
      expect(i18n.options.fallbackLng).toContain('pl');
    });

    it('should support all defined languages', () => {
      const supportedLngs = i18n.options.supportedLngs as string[];
      LANGUAGES.forEach((lang) => {
        expect(supportedLngs).toContain(lang.code);
      });
    });

    it('should change language successfully', async () => {
      await i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');

      await i18n.changeLanguage('pl');
      expect(i18n.language).toBe('pl');
    });
  });

  describe('translations', () => {
    it('should have translations for common.loading in all languages', () => {
      LANGUAGES.forEach((lang) => {
        const translation = i18n.getResource(
          lang.code,
          'translation',
          'common.loading'
        );
        expect(translation).toBeTruthy();
      });
    });

    it('should have translations for dashboard.title in all languages', () => {
      LANGUAGES.forEach((lang) => {
        const translation = i18n.getResource(
          lang.code,
          'translation',
          'dashboard.title'
        );
        expect(translation).toBeTruthy();
      });
    });

    it('should have translations for auth.login.title in all languages', () => {
      LANGUAGES.forEach((lang) => {
        const translation = i18n.getResource(
          lang.code,
          'translation',
          'auth.login.title'
        );
        expect(translation).toBeTruthy();
      });
    });

    it('should translate correctly when language is changed', async () => {
      await i18n.changeLanguage('pl');
      expect(i18n.t('auth.login.title')).toBe('Zaloguj się');

      await i18n.changeLanguage('en');
      expect(i18n.t('auth.login.title')).toBe('Sign In');

      await i18n.changeLanguage('de');
      expect(i18n.t('auth.login.title')).toBe('Anmelden');

      await i18n.changeLanguage('fr');
      expect(i18n.t('auth.login.title')).toBe('Connexion');

      await i18n.changeLanguage('uk');
      expect(i18n.t('auth.login.title')).toBe('Увійти');

      // Reset to Polish
      await i18n.changeLanguage('pl');
    });
  });

  describe('type safety', () => {
    it('LanguageCode should be a valid union type', () => {
      const validCode: LanguageCode = 'pl';
      expect(['pl', 'en', 'de', 'fr', 'uk']).toContain(validCode);
    });
  });
});

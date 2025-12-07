import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

function renderLanguageSwitcher() {
  return render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
    </I18nextProvider>
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset to Polish
    i18n.changeLanguage('pl');
  });

  describe('rendering', () => {
    it('should render language switcher button', () => {
      renderLanguageSwitcher();

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should display current language flag', () => {
      renderLanguageSwitcher();

      // Polish flag emoji should be visible
      expect(screen.getByText('🇵🇱')).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      renderLanguageSwitcher();

      expect(screen.getByText('Change language')).toBeInTheDocument();
    });
  });

  describe('dropdown interaction', () => {
    it('should open dropdown on click', async () => {
      const user = userEvent.setup();
      renderLanguageSwitcher();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        // All language options should be visible
        expect(screen.getByText('Polski')).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Deutsch')).toBeInTheDocument();
        expect(screen.getByText('Français')).toBeInTheDocument();
        expect(screen.getByText('Українська')).toBeInTheDocument();
      });
    });

    it('should change language when clicking on option', async () => {
      const user = userEvent.setup();
      renderLanguageSwitcher();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
      });

      await user.click(screen.getByText('English'));

      await waitFor(() => {
        expect(i18n.language).toBe('en');
      });
    });

    it('should display all 5 supported languages', async () => {
      const user = userEvent.setup();
      renderLanguageSwitcher();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(5);
      });
    });
  });

  describe('language flags', () => {
    it('should show correct flag for each language', async () => {
      const user = userEvent.setup();
      renderLanguageSwitcher();

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        // Use getAllByText since flag appears in button AND menu
        expect(screen.getAllByText('🇵🇱').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('🇬🇧').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('🇩🇪').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('🇫🇷').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('🇺🇦').length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

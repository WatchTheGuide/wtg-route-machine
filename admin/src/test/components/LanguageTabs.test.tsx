import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../test-utils';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import type { LocalizedString } from '@/types';

// Mock useTranslation hook only, preserve other exports
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (
        key: string,
        options?: { defaultValue?: string; language?: string }
      ) => options?.defaultValue || key,
      i18n: {
        changeLanguage: vi.fn(),
        language: 'pl',
      },
    }),
  };
});

describe('LanguageTabs', () => {
  const defaultValue: LocalizedString = { pl: '', en: '' };
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================
  describe('Rendering', () => {
    it('renders all 5 language tabs', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // Check for all language tabs using role selector
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(5);

      // Check for all language codes (lowercase - CSS uppercase is visual only)
      expect(screen.getByText('pl')).toBeInTheDocument();
      expect(screen.getByText('en')).toBeInTheDocument();
      expect(screen.getByText('de')).toBeInTheDocument();
      expect(screen.getByText('fr')).toBeInTheDocument();
      expect(screen.getByText('uk')).toBeInTheDocument();

      // Check for flags
      expect(screen.getByText('🇵🇱')).toBeInTheDocument();
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
      expect(screen.getByText('🇩🇪')).toBeInTheDocument();
      expect(screen.getByText('🇫🇷')).toBeInTheDocument();
      expect(screen.getByText('🇺🇦')).toBeInTheDocument();
    });

    it('shows label when provided', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          label="Tour Name"
        />
      );

      expect(screen.getByText('Tour Name')).toBeInTheDocument();
    });

    it('shows placeholder with language name', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          placeholder="Enter name"
        />
      );

      // PL tab is active by default
      expect(
        screen.getByPlaceholderText('Enter name (Polski)')
      ).toBeInTheDocument();
    });

    it('shows completion badge with correct count', () => {
      const filledValue: LocalizedString = {
        pl: 'Polski tekst',
        en: 'English text',
        de: 'Deutscher Text',
      };

      render(
        <LanguageTabs
          value={filledValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      expect(screen.getByText('3/5')).toBeInTheDocument();
    });

    it('shows Copy from Polish button', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      expect(screen.getByText('Copy from Polish')).toBeInTheDocument();
    });
  });

  // ==========================================
  // INTERACTION TESTS
  // ==========================================
  describe('Interaction', () => {
    it('switches between tabs', async () => {
      const user = userEvent.setup();

      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          placeholder="Enter text"
        />
      );

      // Initially PL tab is active
      expect(
        screen.getByPlaceholderText('Enter text (Polski)')
      ).toBeInTheDocument();

      // Click on EN tab
      await user.click(screen.getByRole('tab', { name: /en/i }));
      expect(
        screen.getByPlaceholderText('Enter text (English)')
      ).toBeInTheDocument();

      // Click on DE tab
      await user.click(screen.getByRole('tab', { name: /de/i }));
      expect(
        screen.getByPlaceholderText('Enter text (Deutsch)')
      ).toBeInTheDocument();

      // Click on FR tab
      await user.click(screen.getByRole('tab', { name: /fr/i }));
      expect(
        screen.getByPlaceholderText('Enter text (Français)')
      ).toBeInTheDocument();

      // Click on UK tab
      await user.click(screen.getByRole('tab', { name: /uk/i }));
      expect(
        screen.getByPlaceholderText('Enter text (Українська)')
      ).toBeInTheDocument();
    });

    it('typing text updates LocalizedString via onChange', async () => {
      const user = userEvent.setup();

      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'T');

      expect(mockOnChange).toHaveBeenCalledWith({
        pl: 'T',
        en: '',
      });
    });

    it('Copy from Polish copies value to all empty fields', async () => {
      const user = userEvent.setup();
      const valueWithPolish: LocalizedString = {
        pl: 'Polski tekst',
        en: '',
        de: 'Already filled',
      };

      render(
        <LanguageTabs
          value={valueWithPolish}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const copyButton = screen.getByText('Copy from Polish');
      await user.click(copyButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        pl: 'Polski tekst',
        en: 'Polski tekst',
        de: 'Already filled', // Should NOT be overwritten
        fr: 'Polski tekst',
        uk: 'Polski tekst',
      });
    });

    it('Copy from Polish button is disabled when PL is empty', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const copyButton = screen.getByText('Copy from Polish').closest('button');
      expect(copyButton).toBeDisabled();
    });

    it('Copy from Polish button is disabled when all fields are filled', () => {
      const allFilled: LocalizedString = {
        pl: 'PL',
        en: 'EN',
        de: 'DE',
        fr: 'FR',
        uk: 'UK',
      };

      render(
        <LanguageTabs
          value={allFilled}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const copyButton = screen.getByText('Copy from Polish').closest('button');
      expect(copyButton).toBeDisabled();
    });

    it('input is disabled when disabled prop is true', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          disabled={true}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  // ==========================================
  // VALIDATION TESTS
  // ==========================================
  describe('Validation', () => {
    it('shows red asterisk for required fields (PL, EN)', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          required={true}
        />
      );

      // Find the tab triggers - PL and EN should have asterisk
      const plTab = screen.getByRole('tab', { name: /🇵🇱.*pl/i });
      const enTab = screen.getByRole('tab', { name: /🇬🇧.*en/i });
      const deTab = screen.getByRole('tab', { name: /🇩🇪.*de/i });

      // PL and EN tabs should contain the asterisk indicator
      expect(plTab.querySelector('.text-destructive')).toBeInTheDocument();
      expect(enTab.querySelector('.text-destructive')).toBeInTheDocument();
      // DE should NOT have the asterisk
      expect(deTab.querySelector('span.text-destructive')).toBeNull();
    });

    it('shows asterisk next to label when required', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          label="Field Label"
          required={true}
        />
      );

      const label = screen.getByText('Field Label');
      const asterisk = label.parentElement?.querySelector('.text-destructive');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent('*');
    });

    it('does not show asterisks when required is false', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          label="Field Label"
          required={false}
        />
      );

      const label = screen.getByText('Field Label');
      const asterisk = label.parentElement?.querySelector('.text-destructive');
      expect(asterisk).toBeNull();
    });

    it('progress bar shows correct percentage for filled fields', () => {
      // 2 out of 5 filled = 40%
      const partialValue: LocalizedString = {
        pl: 'Filled',
        en: 'Filled',
      };

      render(
        <LanguageTabs
          value={partialValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // Check that progress bar exists
      const progressBar = document.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();

      // Verify the completion badge shows correct count (2/5 = 40%)
      expect(screen.getByText('2/5')).toBeInTheDocument();

      // Verify progress indicator has correct transform style (translateX(-60%) for 40% filled)
      const progressIndicator = progressBar?.querySelector('[data-state]');
      if (progressIndicator) {
        expect(progressIndicator).toHaveStyle({
          transform: 'translateX(-60%)',
        });
      }
    });

    it('shows green checkmark for filled fields', () => {
      const filledValue: LocalizedString = {
        pl: 'Polski tekst',
        en: '',
      };

      render(
        <LanguageTabs
          value={filledValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // PL tab should have the Check icon (green checkmark)
      const plTab = screen.getByRole('tab', { name: /🇵🇱.*pl/i });
      // The Check icon should be present in PL tab
      expect(plTab.querySelector('.text-green-500')).toBeInTheDocument();

      // EN tab should NOT have the Check icon
      const enTab = screen.getByRole('tab', { name: /🇬🇧.*en/i });
      expect(enTab.querySelector('.text-green-500')).toBeNull();
    });

    it('shows error message for required empty field when tab is active', async () => {
      const user = userEvent.setup();

      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          required={true}
        />
      );

      // PL tab is active and empty - should show error
      expect(screen.getByText('Polski is required')).toBeInTheDocument();

      // Switch to EN tab
      await user.click(screen.getByRole('tab', { name: /en/i }));
      expect(screen.getByText('English is required')).toBeInTheDocument();

      // Switch to DE tab - no error (DE is not required)
      await user.click(screen.getByRole('tab', { name: /de/i }));
      expect(screen.queryByText(/is required/)).toBeNull();
    });
  });

  // ==========================================
  // PROPS TESTS
  // ==========================================
  describe('Props', () => {
    it('fieldType="input" renders Input element', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input.tagName).toBe('INPUT');
    });

    it('fieldType="textarea" renders Textarea element', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="textarea"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('fieldType="textarea" respects rows prop', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="textarea"
          rows={6}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    it('fieldType="textarea" uses default rows=3 when not specified', () => {
      render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="textarea"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('applies custom className', () => {
      const { container } = render(
        <LanguageTabs
          value={defaultValue}
          onChange={mockOnChange}
          fieldType="input"
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('shows current value in input', () => {
      const valueWithContent: LocalizedString = {
        pl: 'Mój tekst po polsku',
        en: 'My English text',
      };

      render(
        <LanguageTabs
          value={valueWithContent}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Mój tekst po polsku');
    });

    it('displays value for selected language tab', async () => {
      const user = userEvent.setup();
      const valueWithContent: LocalizedString = {
        pl: 'Tekst PL',
        en: 'Text EN',
        de: 'Text DE',
      };

      render(
        <LanguageTabs
          value={valueWithContent}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // PL tab is active by default
      expect(screen.getByRole('textbox')).toHaveValue('Tekst PL');

      // Switch to EN
      await user.click(screen.getByRole('tab', { name: /en/i }));
      expect(screen.getByRole('textbox')).toHaveValue('Text EN');

      // Switch to DE
      await user.click(screen.getByRole('tab', { name: /de/i }));
      expect(screen.getByRole('textbox')).toHaveValue('Text DE');

      // Switch to FR (empty)
      await user.click(screen.getByRole('tab', { name: /fr/i }));
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  // ==========================================
  // EDGE CASES
  // ==========================================
  describe('Edge Cases', () => {
    it('handles undefined optional language values', () => {
      const minimalValue: LocalizedString = {
        pl: 'Polski',
        en: 'English',
        // de, fr, uk are undefined
      };

      render(
        <LanguageTabs
          value={minimalValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // Should show 2/5 filled
      expect(screen.getByText('2/5')).toBeInTheDocument();
    });

    it('handles whitespace-only values as empty', () => {
      const whitespaceValue: LocalizedString = {
        pl: '   ',
        en: '  \t  ',
      };

      render(
        <LanguageTabs
          value={whitespaceValue}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      // Should show 0/5 filled (whitespace-only counts as empty)
      expect(screen.getByText('0/5')).toBeInTheDocument();
    });

    it('Copy from Polish does not copy whitespace-only Polish value', () => {
      const whitespacePolish: LocalizedString = {
        pl: '   ',
        en: '',
      };

      render(
        <LanguageTabs
          value={whitespacePolish}
          onChange={mockOnChange}
          fieldType="input"
        />
      );

      const copyButton = screen.getByText('Copy from Polish').closest('button');
      expect(copyButton).toBeDisabled();
    });
  });
});

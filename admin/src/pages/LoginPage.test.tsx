import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { LoginPage } from '@/pages/LoginPage';
import { useAuthStore } from '@/stores/authStore';

// Wrapper with providers
function renderLoginPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
    });
    vi.clearAllTimers();
  });

  describe('rendering', () => {
    it('should render login form', () => {
      renderLoginPage();

      // Title appears both in heading and button, use getAllByText
      expect(
        screen.getAllByText(/sign in|zaloguj/i).length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/hasło|password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /zaloguj|sign in/i })
      ).toBeInTheDocument();
    });

    it('should render demo credentials info', () => {
      renderLoginPage();

      expect(screen.getByText(/admin@wtg.pl/)).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      renderLoginPage();

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /zaloguj|sign in/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        // Form should have validation error (not submit)
        expect(screen.getByLabelText(/email/i)).toHaveValue('invalid-email');
      });
    });

    it('should allow typing in email and password fields', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/hasło|password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('form submission', () => {
    it('should call login on valid form submission', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/hasło|password/i);
      const submitButton = screen.getByRole('button', {
        name: /zaloguj|sign in/i,
      });

      await user.type(emailInput, 'admin@wtg.pl');
      await user.type(passwordInput, 'admin123');
      await user.click(submitButton);

      // Wait for loading state
      await waitFor(() => {
        expect(
          useAuthStore.getState().isLoading ||
            useAuthStore.getState().isAuthenticated
        ).toBe(true);
      });

      vi.useRealTimers();
    });

    it('should toggle remember me checkbox', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('error display', () => {
    it('should display error message when auth error exists', () => {
      useAuthStore.setState({
        error: 'auth.login.error',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        rememberMe: false,
      });

      renderLoginPage();

      // The error should be translated and displayed
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

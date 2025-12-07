import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAuthStore.getState();
    store.logout();
    store.clearError();

    // Clear any timers
    vi.clearAllTimers();
  });

  describe('initial state', () => {
    it('should have null user by default', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should not be authenticated by default', () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should have no error by default', () => {
      const { error } = useAuthStore.getState();
      expect(error).toBeNull();
    });

    it('should not be loading by default', () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      vi.useFakeTimers();

      const loginPromise = useAuthStore
        .getState()
        .login('admin@wtg.pl', 'admin123', false);

      // Fast-forward timer
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      const { user, isAuthenticated, token } = useAuthStore.getState();

      expect(isAuthenticated).toBe(true);
      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@wtg.pl');
      expect(user?.name).toBe('Administrator');
      expect(user?.role).toBe('admin');
      expect(token).toBeTruthy();

      vi.useRealTimers();
    });

    it('should set loading state during login', async () => {
      vi.useFakeTimers();

      const loginPromise = useAuthStore
        .getState()
        .login('admin@wtg.pl', 'admin123', false);

      // Check loading state immediately after calling login
      expect(useAuthStore.getState().isLoading).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      expect(useAuthStore.getState().isLoading).toBe(false);

      vi.useRealTimers();
    });

    it('should fail with invalid credentials', async () => {
      vi.useFakeTimers();

      const loginPromise = useAuthStore
        .getState()
        .login('wrong@email.com', 'wrongpass', false);

      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      const { user, isAuthenticated, error } = useAuthStore.getState();

      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
      expect(error).toBe('auth.errors.invalidCredentials');

      vi.useRealTimers();
    });

    it('should login as editor with editor credentials', async () => {
      vi.useFakeTimers();

      const loginPromise = useAuthStore
        .getState()
        .login('editor@wtg.pl', 'editor123', false);

      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      const { user } = useAuthStore.getState();

      expect(user?.email).toBe('editor@wtg.pl');
      expect(user?.role).toBe('editor');

      vi.useRealTimers();
    });

    it('should set rememberMe flag when provided', async () => {
      vi.useFakeTimers();

      const loginPromise = useAuthStore
        .getState()
        .login('admin@wtg.pl', 'admin123', true);

      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      const { rememberMe } = useAuthStore.getState();
      expect(rememberMe).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      vi.useFakeTimers();

      // First login
      const loginPromise = useAuthStore
        .getState()
        .login('admin@wtg.pl', 'admin123', false);
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      // Verify logged in
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Logout
      act(() => {
        useAuthStore.getState().logout();
      });

      const { user, isAuthenticated, token } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isAuthenticated).toBe(false);
      expect(token).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('clearError', () => {
    it('should clear error message', async () => {
      vi.useFakeTimers();

      // Trigger an error
      const loginPromise = useAuthStore
        .getState()
        .login('wrong@email.com', 'wrong', false);
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await loginPromise;
      });

      expect(useAuthStore.getState().error).not.toBeNull();

      // Clear error
      act(() => {
        useAuthStore.getState().clearError();
      });

      expect(useAuthStore.getState().error).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('checkAuth', () => {
    it('should invalidate auth if no token', () => {
      act(() => {
        useAuthStore.getState().checkAuth();
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});

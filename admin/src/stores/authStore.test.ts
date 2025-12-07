import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';
import * as authService from '@/services/auth.service';

// Mock auth service
vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock('@/services/api.client', () => ({
  setAccessToken: vi.fn(),
  getRefreshToken: vi.fn(() => null),
  ApiClientError: class ApiClientError extends Error {
    status: number;
    errorCode: string;
    constructor(status: number, errorCode: string, message: string) {
      super(message);
      this.status = status;
      this.errorCode = errorCode;
    }
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    vi.clearAllMocks();
    const store = useAuthStore.getState();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
    });
    store.clearError();
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
      const mockResponse = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        user: { id: '1', email: 'admin@wtg.pl', role: 'admin' as const },
        expiresIn: 3600,
      };
      vi.mocked(authService.authService.login).mockResolvedValue(mockResponse);

      await act(async () => {
        await useAuthStore.getState().login('admin@wtg.pl', 'admin123', false);
      });

      const { user, isAuthenticated } = useAuthStore.getState();

      expect(isAuthenticated).toBe(true);
      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@wtg.pl');
      expect(user?.role).toBe('admin');
    });

    it('should set loading state during login', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        user: { id: '1', email: 'admin@wtg.pl', role: 'admin' as const },
        expiresIn: 3600,
      };

      let resolveLogin: () => void;
      const loginPromise = new Promise<typeof mockResponse>((resolve) => {
        resolveLogin = () => resolve(mockResponse);
      });
      vi.mocked(authService.authService.login).mockReturnValue(loginPromise);

      const loginCall = useAuthStore
        .getState()
        .login('admin@wtg.pl', 'admin123', false);

      // Check loading state immediately after calling login
      expect(useAuthStore.getState().isLoading).toBe(true);

      await act(async () => {
        resolveLogin!();
        await loginCall;
      });

      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('should fail with invalid credentials', async () => {
      const { ApiClientError } = await import('@/services/api.client');
      vi.mocked(authService.authService.login).mockRejectedValue(
        new ApiClientError(401, 'Unauthorized', 'Invalid credentials')
      );

      await act(async () => {
        await useAuthStore
          .getState()
          .login('wrong@email.com', 'wrongpass', false);
      });

      const { user, isAuthenticated, error } = useAuthStore.getState();

      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
      expect(error).toBe('auth.errors.invalidCredentials');
    });

    it('should set rememberMe flag when provided', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        user: { id: '1', email: 'admin@wtg.pl', role: 'admin' as const },
        expiresIn: 3600,
      };
      vi.mocked(authService.authService.login).mockResolvedValue(mockResponse);

      await act(async () => {
        await useAuthStore.getState().login('admin@wtg.pl', 'admin123', true);
      });

      const { rememberMe } = useAuthStore.getState();
      expect(rememberMe).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        user: { id: '1', email: 'admin@wtg.pl', role: 'admin' as const },
        expiresIn: 3600,
      };
      vi.mocked(authService.authService.login).mockResolvedValue(mockResponse);
      vi.mocked(authService.authService.logout).mockResolvedValue(undefined);

      // First login
      await act(async () => {
        await useAuthStore.getState().login('admin@wtg.pl', 'admin123', false);
      });

      // Verify logged in
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Logout
      await act(async () => {
        await useAuthStore.getState().logout();
      });

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error message', async () => {
      const { ApiClientError } = await import('@/services/api.client');
      vi.mocked(authService.authService.login).mockRejectedValue(
        new ApiClientError(401, 'Unauthorized', 'Invalid credentials')
      );

      // Trigger an error
      await act(async () => {
        await useAuthStore.getState().login('wrong@email.com', 'wrong', false);
      });

      expect(useAuthStore.getState().error).not.toBeNull();

      // Clear error
      act(() => {
        useAuthStore.getState().clearError();
      });

      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should invalidate auth if no refresh token', async () => {
      await act(async () => {
        await useAuthStore.getState().checkAuth();
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});

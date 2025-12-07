import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  authService,
  type AuthUser,
  ApiClientError,
  getRefreshToken,
} from '@/services';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;

  // Actions
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Convert AuthUser from API to User for store
const mapAuthUserToUser = (authUser: AuthUser): User => ({
  id: authUser.id,
  email: authUser.email,
  name: authUser.email.split('@')[0], // Use email prefix as name
  role: authUser.role,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,

      login: async (email: string, password: string, rememberMe: boolean) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ email, password });

          set({
            user: mapAuthUserToUser(response.user),
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
            error: null,
          });
        } catch (error) {
          let errorMessage = 'auth.errors.networkError';

          if (error instanceof ApiClientError) {
            if (error.status === 401) {
              errorMessage = 'auth.errors.invalidCredentials';
            } else if (error.status === 429) {
              errorMessage = 'auth.errors.tooManyAttempts';
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const { rememberMe } = get();

        // If no refresh token stored, user is not authenticated
        if (!rememberMe || !getRefreshToken()) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const authUser = await authService.checkAuth();

          if (authUser) {
            set({
              user: mapAuthUserToUser(authUser),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'wtg-auth-storage',
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AuthState {
  user: User | null;
  token: string | null;
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
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock users for demo (will be replaced with real API)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@wtg.pl',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'editor@wtg.pl',
    password: 'editor123',
    name: 'Editor',
    role: 'editor' as const,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,

      login: async (email: string, password: string, rememberMe: boolean) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await delay(800);

          const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
          );

          if (!user) {
            set({ isLoading: false, error: 'auth.errors.invalidCredentials' });
            return;
          }

          // Generate mock token
          const token = btoa(`${user.id}:${Date.now()}`);

          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            token,
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
            error: null,
          });
        } catch {
          set({
            isLoading: false,
            error: 'auth.errors.networkError',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { token, rememberMe } = get();

        // If no token or not remember me, clear auth
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        // Check token expiration (mock: 24h for remember me, 1h otherwise)
        try {
          const [, timestamp] = atob(token).split(':');
          const tokenAge = Date.now() - parseInt(timestamp, 10);
          const maxAge = rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

          if (tokenAge > maxAge) {
            set({ isAuthenticated: false, user: null, token: null });
          }
        } catch {
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'wtg-auth-storage',
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        token: state.rememberMe ? state.token : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

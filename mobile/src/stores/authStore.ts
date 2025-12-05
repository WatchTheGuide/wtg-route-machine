/**
 * WTG Routes - Auth Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with Supabase auth
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user: User = {
            id: '1',
            email,
            name: 'Test User',
            subscription: 'free',
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (email, password, name) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with Supabase auth
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            subscription: 'free',
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          // TODO: Replace with Supabase auth
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          // TODO: Replace with Supabase update
          await new Promise((resolve) => setTimeout(resolve, 500));

          set({
            user: { ...user, ...updates },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

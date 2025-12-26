'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse, setToken, removeToken } from '@/src/lib/api';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserResponse) => void;
  login: (accessToken: string, user: UserResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      login: (accessToken, user) => {
        setToken(accessToken);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        removeToken();
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

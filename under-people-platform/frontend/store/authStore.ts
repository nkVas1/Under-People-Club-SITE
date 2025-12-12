'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  telegram_id: number;
  up_coins: number;
  role: 'ranger' | 'stalker' | 'elder';
  clan: string;
  ref_code: string;
  avatar_url?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateCoins: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateCoins: (amount) => 
        set((state) => ({
          user: state.user ? { ...state.user, up_coins: amount } : null
        })),
    }),
    {
      name: 'up-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

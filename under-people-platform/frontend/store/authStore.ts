'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  first_name: string;
  role: string;
  clan: string;
  up_coins: number;
  avatar_url: string;
  ref_code: string;
  referral_code: string;  // ← ДОБАВИТЬ
  photo_url?: string;  // ← ДОБАВИТЬ
  membership_level: string;  // ← ДОБАВИТЬ
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateCoins: (amount: number) => void;
  updateUser: (userData: Partial<User>) => void;  // ← ДОБАВИТЬ
  token?: string;  // ← ДОБАВИТЬ ДЛЯ API ЗАПРОСОВ
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData: User) => {
        console.log("🔐 [AUTH] Logging in:", userData.username);
        set({ user: userData, isAuthenticated: true });
      },
      
      logout: () => {
        console.log("🔒 [AUTH] Logging out");
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('up-cart-storage');
      },

      updateCoins: (amount: number) => 
        set((state) => ({
          user: state.user ? { ...state.user, up_coins: amount } : null
        })),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
    }),
    {
      name: 'up-auth-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // Критично для Next.js! Гидрируем вручную через useAuth хук
    }
  )
);

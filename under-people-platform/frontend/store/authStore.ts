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
  referral_code: string;
  photo_url?: string;
  membership_level: string;
  telegram_id?: number;  // ← ДОБАВИТЬ (используется в callback)
  token?: string;  // ← ДОБАВИТЬ (для хранения access_token)
  is_verified?: boolean;  // ← ДОБАВИТЬ (используется в callback)
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
        console.log("🔒 [AUTH] Logging out - clearing all data");
        
        // Очищаем Zustand состояние
        set({ user: null, isAuthenticated: false });
        
        // Очищаем localStorage полностью
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_expires');
        localStorage.removeItem('user_data');
        localStorage.removeItem('up-auth-storage');
        localStorage.removeItem('up-cart-storage');
        localStorage.removeItem('cached_user');
        localStorage.removeItem('last_fetch');
        
        // Очищаем sessionStorage
        sessionStorage.clear();
        
        // Очищаем все cache-related данные
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName);
            });
          });
        }
        
        console.log("✅ [AUTH] All data cleared");
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

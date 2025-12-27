import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook для периодической синхронизации баланса с сервером
 * Обновляет баланс каждые 30 секунд
 */
export const useSyncBalance = () => {
  const { user, isAuthenticated } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const syncBalance = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        const response = await fetch(`${apiUrl}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn('⚠️ [BALANCE SYNC] Failed to sync balance:', response.status);
          return;
        }

        const data = await response.json();
        
        // Обновляем только баланс и другие изменяемые поля
        if (data.up_coins !== undefined) {
          updateUser({
            up_coins: data.up_coins,
            avatar_url: data.photo_url || user.avatar_url,
            membership_level: data.membership_level || user.membership_level,
          });
          console.log('✅ [BALANCE SYNC] Balance updated:', data.up_coins, 'UP');
        }
      } catch (error) {
        console.error('❌ [BALANCE SYNC] Error:', error);
      }
    };

    // Синхронизируем сразу при входе
    syncBalance();

    // Затем каждые 30 секунд
    const interval = setInterval(syncBalance, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, updateUser]);
};

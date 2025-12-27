import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook для периодической синхронизации баланса с сервером
 * Оптимизирован с кэшированием, debounce и ETag валидацией
 * 
 * Проблема: Каждые 100-200ms запросы к /api/users/me
 * Решение: 
 * - Кэш на 5 минут
 * - Debounce 300ms для снижения частоты
 * - ETag проверка (If-None-Match)
 */
export const useSyncBalance = () => {
  const { user, isAuthenticated } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  
  // Кэш состояние
  const cacheRef = useRef({
    cachedUser: null as any,
    lastFetch: 0,
    lastEtag: null as string | null,
  });
  
  const CACHE_DURATION = 5 * 60 * 1000; // 5 минут
  const SYNC_INTERVAL = 30000; // 30 секунд между попытками sync
  const DEBOUNCE_DELAY = 300; // 300ms debounce
  
  // Debounce таймер
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const syncBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      const now = Date.now();
      const { cachedUser, lastFetch, lastEtag } = cacheRef.current;

      // Проверяем кэш - если данные свежие, возвращаем кэшированные
      if (cachedUser && (now - lastFetch < CACHE_DURATION)) {
        console.log('📦 [BALANCE SYNC] Using cached data (age:', Math.round((now - lastFetch) / 1000), 's)');
        return cachedUser;
      }

      // Готовим заголовки для запроса
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Добавляем If-None-Match если есть ETag
      if (lastEtag) {
        headers['If-None-Match'] = lastEtag;
      }

      console.log('🔄 [BALANCE SYNC] Fetching from server...');
      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: 'GET',
        headers,
      });

      // 304 Not Modified - данные не изменились
      if (response.status === 304) {
        console.log('✅ [BALANCE SYNC] Data unchanged (304 Not Modified)');
        cacheRef.current.lastFetch = now;
        return cachedUser;
      }

      if (!response.ok) {
        console.warn('⚠️ [BALANCE SYNC] Server error:', response.status);
        return null;
      }

      const data = await response.json();
      
      // Обновляем кэш
      cacheRef.current.cachedUser = data;
      cacheRef.current.lastFetch = now;
      
      // Сохраняем новый ETag
      const newEtag = response.headers.get('ETag');
      if (newEtag) {
        cacheRef.current.lastEtag = newEtag;
      }

      // Обновляем Zustand store
      if (data.up_coins !== undefined) {
        updateUser({
          up_coins: data.up_coins,
          avatar_url: data.photo_url || user?.avatar_url,
          membership_level: data.membership_level || user?.membership_level,
        });
        console.log('✅ [BALANCE SYNC] Balance updated:', data.up_coins, 'UP (from server)');
      }

      return data;
    } catch (error) {
      console.error('❌ [BALANCE SYNC] Error:', error);
      return null;
    }
  }, [user, updateUser]);

  const debouncedSync = useCallback(() => {
    // Очищаем предыдущий таймер если был
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Создаем новый debounced запрос
    debounceTimerRef.current = setTimeout(() => {
      syncBalance();
      debounceTimerRef.current = null;
    }, DEBOUNCE_DELAY);
  }, [syncBalance]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Очищаем кэш при выходе
      cacheRef.current = {
        cachedUser: null,
        lastFetch: 0,
        lastEtag: null,
      };
      return;
    }

    // Синхронизируем сразу при входе
    debouncedSync();

    // Затем каждые 30 секунд
    const interval = setInterval(debouncedSync, SYNC_INTERVAL);

    return () => {
      clearInterval(interval);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isAuthenticated, user, debouncedSync]);
};

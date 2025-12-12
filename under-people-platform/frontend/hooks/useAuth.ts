import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ждем, пока Zustand подтянет данные из localStorage
    useAuthStore.persist?.rehydrate();
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated, // Используйте этот флаг, чтобы не показывать форму входа на секунду
  };
};

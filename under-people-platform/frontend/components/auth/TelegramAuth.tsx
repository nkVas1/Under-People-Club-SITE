'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function TelegramAuth() {
  const login = useAuthStore((state) => state.login);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Функция-коллбек, которую вызовет Telegram виджет
    // @ts-ignore
    window.onTelegramAuth = async (user: any) => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔐 [TELEGRAM AUTH] Отправляем данные на backend:', user);
        
        // ОТПРАВЛЯЕМ ДАННЫЕ НА PYTHON BACKEND
        const response = await fetch(`${API_URL}/api/auth/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error(`Auth verification failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [TELEGRAM AUTH] Backend ответил:', data);
        
        // Логиним в Zustand стор с реальными данными от backend'а + JWT токеном
        login({
          ...data.user,
          token: data.access_token, // Сохраняем JWT от backend'а!
          is_verified: true,
          avatar_url: user.photo_url || data.user.avatar_url,
        });

        console.log('✅ [AUTH] Пользователь залогирован');

      } catch (error) {
        console.error('❌ [TELEGRAM AUTH ERROR]', error);
        setError('Ошибка при проверке подписи. Попробуйте ещё раз.');
      } finally {
        setIsLoading(false);
      }
    };

    // Вставляем скрипт виджета
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute('data-telegram-login', 'UPCworld_bot'); // ИМЯ ВАШЕГО БОТА
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '0');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, [login]);

  if (isLoading) {
    return (
      <div className="text-[#8A0303] font-mono animate-pulse text-xs tracking-[0.2em] uppercase">
        [ ПРОВЕРКА БИОМЕТРИИ... ]
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 font-mono text-xs text-center max-w-[300px] tracking-[0.15em]">
        [ ❌ {error} ]
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
      <div 
        ref={containerRef} 
        className="grayscale hover:grayscale-0 transition-all duration-500 bg-white/5 p-2 border border-white/10 rounded-sm"
      />
      <p className="text-[10px] text-zinc-500 font-mono text-center max-w-[250px] uppercase tracking-[0.15em]">
        * Защищённое соединение требуется для доступа
      </p>
    </div>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function TelegramAuth() {
  const login = useAuthStore((state) => state.login);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Функция-коллбек, которую вызовет Telegram виджет
    (window as any).onTelegramAuth = (user: any) => {
      // Генерируем данные на основе ответа Telegram
      const userData = {
        id: user.id.toString(),
        username: user.username || user.first_name,
        telegram_id: user.id,
        up_coins: 50, // Бонус новичка
        role: 'ranger' as const,
        clan: 'Новичок',
        ref_code: `UP-${user.id.toString().slice(-4)}`,
        avatar_url: user.photo_url,
        is_verified: true
      };
      
      console.log("✅ [TELEGRAM] User authenticated:", userData);
      login(userData);
    };

    // Вставляем скрипт виджета
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute('data-telegram-login', 'UPCworld_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '0');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, [login]);

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
      <div 
        ref={containerRef} 
        className="grayscale hover:grayscale-0 transition-all duration-500 bg-white/5 p-2 border border-white/10 rounded-sm"
      />
      <p className="text-[10px] text-zinc-500 font-mono text-center max-w-[250px] uppercase tracking-[0.15em]">
        * Вход через протокол telegram для доступа к защищённой территории
      </p>
    </div>
  );
}

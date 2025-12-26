'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  const login = useAuthStore((state) => state.login);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Если есть ошибка от Telegram
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Если нет кода
        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        console.log('🔐 [AUTH CALLBACK] Обмениваем код на токен:', code);
        setMessage('[ VERIFYING CREDENTIALS... ]');

        // Обмениваем код на токен
        const response = await fetch(`${API_URL}/api/auth/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [AUTH CALLBACK] Получили данные:', data);

        if (!data.access_token || !data.user) {
          throw new Error('Invalid response from server');
        }

        // Сохраняем пользователя и токен в store
        login({
          ...data.user,
          token: data.access_token,
          is_verified: true,
        });

        setStatus('success');
        setMessage('[ IDENTITY CONFIRMED ]');

        // Редиректим в кабинет через 1 секунду
        setTimeout(() => {
          router.push('/shelter');
        }, 1000);

      } catch (err) {
        console.error('❌ [AUTH CALLBACK ERROR]', err);
        setStatus('error');
        setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        
        // Возвращаем на главную через 3 секунды
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    handleAuth();
  }, [code, error, router, login, API_URL]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Сетка фона */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10 text-center space-y-6">
        {/* Статус */}
        {status === 'loading' && (
          <>
            <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 animate-pulse">
              ESTABLISHING<br />SECURE LINK
            </div>
            <p className="text-[#8A0303] font-mono text-xs tracking-[0.3em] uppercase">
              Neural Interface Active
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="w-2 h-2 bg-[#8A0303] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-zinc-600">{message}</span>
              <div className="w-2 h-2 bg-[#8A0303] rounded-full animate-pulse" />
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600">
              ACCESS GRANTED
            </div>
            <p className="text-green-400 font-mono text-xs tracking-[0.3em] uppercase">
              ✓ {message}
            </p>
            <p className="text-zinc-500 text-sm pt-4">Redirecting to your shelter...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600">
              ACCESS DENIED
            </div>
            <p className="text-red-400 font-mono text-xs tracking-[0.3em] uppercase">
              ✗ {message}
            </p>
            <p className="text-zinc-500 text-sm pt-4">Returning to main page...</p>
          </>
        )}
      </div>

      {/* Декоративные квадраты */}
      <div className="absolute bottom-6 left-6 w-8 h-8 border-2 border-[#8A0303]/20 opacity-50" />
      <div className="absolute top-6 right-6 w-12 h-12 border-2 border-[#8A0303]/10 opacity-30" />
    </div>
  );
}

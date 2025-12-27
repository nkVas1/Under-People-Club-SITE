'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const login = useAuthStore((state) => state.login);
  const [status, setStatus] = useState<string>('INITIALIZING SECURE HANDSHAKE...');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    if (!code) {
      setStatus('ERROR: MISSING AUTH CODE');
      console.error('❌ [AUTH] No code in URL params');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const telegramId = typeof window !== 'undefined' 
      ? (window as any).Telegram?.WebApp?.initData?.user?.id 
      : null;
    
    if (!apiUrl) {
      setStatus('ERROR: API URL NOT CONFIGURED');
      console.error('❌ [AUTH] NEXT_PUBLIC_API_URL is not set');
      return;
    }

    if (!telegramId) {
      setStatus('ERROR: TELEGRAM ID NOT AVAILABLE');
      console.error('❌ [AUTH] Telegram ID is not available');
      return;
    }

    console.log('🔐 [AUTH CALLBACK] Starting auth flow');
    console.log('Code:', code);
    console.log('Telegram ID:', telegramId);
    console.log('API URL:', apiUrl);

    setStatus('CONNECTING TO NEURAL NETWORK...');

    // Делаем запрос на обмен кода через query параметры
    const callbackUrl = `${apiUrl}/api/auth/callback?code=${encodeURIComponent(code)}&telegram_id=${telegramId}`;
    
    fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(async (res) => {
        console.log('📨 [AUTH] Response status:', res.status);

        if (!res.ok) {
          // Пытаемся прочитать текст ошибки от сервера
          const errorText = await res.text();
          console.error('❌ [AUTH] Server error:', errorText);
          throw new Error(`Server Error (${res.status}): ${errorText || 'No response body'}`);
        }

        const data = await res.json();
        console.log('✅ [AUTH] Received data:', data);
        return data;
      })
      .then((data) => {
        if (data.token && data.user) {
          setStatus('ACCESS GRANTED. REDIRECTING...');
          console.log('✅ [AUTH] Token received, logging in user:', data.user);

          // Сохраняем данные пользователя
          login({
            id: data.user.id,
            username: data.user.username || `User_${data.user.telegram_id}`,
            first_name: data.user.username,
            role: data.user.role || 'RANGER',
            clan: data.user.clan_name || 'UNAFFILIATED',
            up_coins: data.user.up_coins || 0,
            avatar_url: data.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.username || 'User')}&background=8A0303&color=fff`,
            ref_code: data.user.referral_code,
            referral_code: data.user.referral_code,
            photo_url: data.user.avatar_url,
            membership_level: data.user.role,
            telegram_id: data.user.telegram_id,
            token: data.token,
            is_verified: true,
          });

          // Сохраняем токен в localStorage для API запросов
          localStorage.setItem('auth_token', data.token);

          // Небольшая задержка для красоты
          setTimeout(() => {
            console.log('🚀 [AUTH] Redirecting to /shelter');
            router.push('/shelter');
          }, 1000);
        } else {
          throw new Error('Token or user data missing in response');
        }
      })
      .catch((err) => {
        console.error('❌ [AUTH CALLBACK ERROR]', err);
        setStatus('ACCESS DENIED');

        // Детальная информация об ошибке
        let errorMsg = 'Unknown error';
        if (err instanceof TypeError && err.message.includes('fetch')) {
          errorMsg = 'CORS/Network Error: Check API URL or Backend CORS settings';
        } else if (err instanceof SyntaxError) {
          errorMsg = 'Invalid JSON response from server';
        } else {
          errorMsg = err.message || 'Network Error';
        }

        setErrorDetails(errorMsg);
      });
  }, [code, login]);

  return (
    <div className="min-h-screen bg-black text-[#8A0303] flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-2xl md:text-4xl font-black mb-6 tracking-widest animate-pulse text-center">
        {status}
      </h1>

      {errorDetails && (
        <div className="border border-red-900 bg-red-950/30 p-4 max-w-md w-full text-xs md:text-sm text-red-400 rounded-sm">
          <p className="font-bold mb-3 uppercase tracking-wider">🔍 Diagnostic Report:</p>
          <code className="break-all block bg-red-900/20 p-2 mb-3 rounded-sm">{errorDetails}</code>
          <p className="text-[10px] text-red-500 mb-4">
            💡 Troubleshooting:
            <br />
            • Check if API_URL in Vercel Environment Variables is set correctly (HTTPS)
            <br />
            • Verify backend is running and CORS is configured
            <br />
            • Check browser DevTools Network tab for failed requests
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-red-800 py-2 hover:bg-red-900/50 transition-colors uppercase text-sm font-bold"
          >
            Return to Surface
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-[#8A0303] flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-2xl md:text-4xl font-black mb-6 tracking-widest animate-pulse text-center">
        ESTABLISHING SECURE LINK...
      </h1>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

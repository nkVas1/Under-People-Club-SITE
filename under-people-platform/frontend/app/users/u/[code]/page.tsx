'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface UserProfile {
  id: string;
  username: string;
  telegram_id: number;
  avatar_url: string;
  role: string;
  clan_name: string | null;
  up_coins: number;
  referral_code: string;
  created_at: string;
  level: number;
}

interface ApiUser {
  id: string;
  username: string;
  telegram_id: number;
  avatar_url: string;
  role: string;
  clan_name: string | null;
  up_coins: number;
  referral_code: string;
  created_at: string;
  level?: number;
}

export default function PublicProfilePage() {
  const params = useParams();
  const code = params.code as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const response = await fetch(`${apiUrl}/api/users/u/${code}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('User not found');
          } else {
            setError(`Error loading profile (${response.status})`);
          }
          return;
        }

        const data: ApiUser = await response.json();
        setUser({
          ...data,
          level: data.level || 1,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchUserProfile();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400 font-mono">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'Unable to load user profile'}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const membershipColors: { [key: string]: string } = {
    RANGER: 'from-green-500 to-emerald-600',
    GUARDIAN: 'from-blue-500 to-cyan-600',
    WARDEN: 'from-purple-500 to-pink-600',
    SAGE: 'from-yellow-500 to-orange-600',
    LEGEND: 'from-red-500 to-rose-600',
  };

  const gradientClass = membershipColors[user.role] || 'from-gray-500 to-gray-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Карточка профиля */}
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Хедер с градиентом */}
          <div className={`bg-gradient-to-r ${gradientClass} h-32 relative`}>
            <div className="absolute inset-0 opacity-50 mix-blend-overlay"></div>
          </div>

          {/* Основной контент */}
          <div className="px-6 pb-6">
            {/* Аватар */}
            <div className="flex flex-col items-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                  <Image
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=8A0303&color=fff`}
                    alt={user.username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=8A0303&color=fff`;
                    }}
                  />
                </div>
                <div className={`absolute bottom-0 right-0 bg-gradient-to-r ${gradientClass} px-3 py-1 rounded-full text-white text-sm font-bold`}>
                  Lvl {user.level}
                </div>
              </div>
            </div>

            {/* Основная информация */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">{user.username}</h1>
              <div className={`inline-block bg-gradient-to-r ${gradientClass} text-white px-4 py-1 rounded-full text-sm font-semibold mb-4`}>
                {user.role}
              </div>

              {/* Статус верификации */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified User
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">UP Coins</p>
                <p className="text-2xl font-bold text-blue-400">{user.up_coins.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-lg font-bold text-purple-400">{user.clan_name || 'Unaffiliated'}</p>
              </div>
            </div>

            {/* Реферальный код */}
            <div className="bg-gradient-to-r from-slate-700/30 to-slate-600/30 border border-slate-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Referral Code</p>
                  <p className="text-lg font-mono font-bold text-white">{user.referral_code}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.referral_code);
                    alert('Copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Ссылка на присоединение */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-3">Invite to join:</p>
              <a
                href={`tg://resolve?domain=${user.username}&start=${user.referral_code}`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-bold"
              >
                Open in Telegram
              </a>
            </div>

            {/* Информация о пользователе */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="text-center text-sm text-gray-500">
                <p>Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка возврата */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

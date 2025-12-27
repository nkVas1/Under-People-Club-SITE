'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PublicProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  achievements_count: number;
  referral_code: string;
  photo_url?: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const referralCode = params.referralCode as string;
  
  const [user, setUser] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error('API URL not configured');
          setNotFoundError(true);
          return;
        }

        // КРИТИЧНО: Используем правильный путь /api/users/u/{referralCode}
        const fetchUrl = `${apiUrl}/api/users/u/${referralCode}`;
        console.log(`🔍 Fetching public profile: ${fetchUrl}`);
        
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          if (response.status === 404) {
            console.error(`❌ Profile not found: ${referralCode}`);
            setNotFoundError(true);
          }
          const errorText = await response.text();
          console.error(`❌ Error: ${response.status} - ${errorText}`);
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Profile data received:', data);
        
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    if (referralCode) {
      fetchProfile();
    }
  }, [referralCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-[#8A0303] border-t-transparent rounded-full mx-auto" />
          </div>
          <p className="text-zinc-400 font-mono">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  if (notFoundError || !user) {
    return (
      <div className="min-h-screen bg-[#100000] text-[#8A0303] flex items-center justify-center font-mono p-4">
        <div className="border-2 border-[#8A0303] p-8 text-center max-w-md">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-4">ERROR</h1>
          <p className="text-sm mb-4">PROFILE NOT FOUND</p>
          <p className="text-xs text-red-700 mb-6">CODE: {referralCode}</p>
          <a
            href="/"
            className="inline-block border border-[#8A0303] px-6 py-2 hover:bg-[#8A0303] hover:text-white transition-colors"
          >
            Return to Main
          </a>
        </div>
      </div>
    );
  }

  const joinBotUrl = `https://t.me/UPCworld_bot?start=${referralCode}`;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="border-2 border-[#8A0303] bg-[#050505] p-8 relative group">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8A0303]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8A0303]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8A0303]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8A0303]" />

          <div className="text-center relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-[#8A0303] overflow-hidden">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>

            {/* Name and Status */}
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
              {user.full_name}
            </h1>
            <p className="text-[#8A0303] font-mono text-sm tracking-wider mb-4">
              {user.role.toUpperCase()} // VERIFIED
            </p>

            {/* Verification Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 font-bold tracking-widest text-xs">VERIFIED MEMBER</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 my-6 border-y border-zinc-700 py-6">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Joined</p>
                <p className="text-white font-mono">
                  {new Date(user.created_at).toLocaleDateString('en-US')}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Achievements</p>
                <p className="text-white font-mono">{user.achievements_count}</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-700 rounded-sm">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Referral Code</p>
              <p className="text-xl font-mono text-[#8A0303] font-bold">{user.referral_code}</p>
            </div>

            {/* Join Button */}
            <a
              href={joinBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#8A0303] hover:bg-red-700 text-white py-3 px-4 font-mono uppercase tracking-wider transition-colors mb-4"
            >
              🤖 Join in Telegram
            </a>

            {/* Social Info */}
            <p className="text-xs text-zinc-500 font-mono text-center">
              [ UNDER PEOPLE CLUB // EXCLUSIVE MEMBERS ONLY ]
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-zinc-600 font-mono">
          <p>under-people-club.vercel.app</p>
          <p>Public Profile // Verified Access</p>
        </div>
      </div>
    </div>
  );
}

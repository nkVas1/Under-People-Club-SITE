'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://upcworldbot-production.up.railway.app';

interface PublicProfile {
  id: number;
  username: string | null;
  first_name: string | null;
  referral_code: string;
  membership_level: string;
  is_verified: boolean;
  avatar_url: string;
  created_at: string | null;
}

export default function PublicProfilePage() {
  const params = useParams();
  const code = params.code as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = `${API_URL}/api/users/u/${code}`;
        console.log('🔍 Fetching public profile:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            const errorData = await response.json().catch(() => ({ detail: 'Profile not found' }));
            throw new Error(errorData.detail || `PROFILE NOT FOUND - CODE: ${code}`);
          }
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        setProfile(data);
        console.log('✅ Profile loaded:', data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchProfile();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="text-center max-w-md p-8 bg-gray-900 rounded-lg border border-red-600">
          <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">PROFILE NOT FOUND</h2>
          <p className="text-gray-400 mb-2 font-mono text-sm">CODE: {code}</p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <a
            href="https://t.me/UPCworld_bot"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Open Bot
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-1 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800">
              <img 
                src={profile.avatar_url} 
                alt={profile.first_name || 'User'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {profile.first_name || profile.username || 'Anonymous'}
          </h1>
          
          {profile.username && (
            <p className="text-gray-400 mb-2">@{profile.username}</p>
          )}
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              profile.membership_level === 'VIP' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
              profile.membership_level === 'VERIFIED' ? 'bg-gradient-to-r from-blue-600 to-blue-400' :
              profile.membership_level === 'MEMBER' ? 'bg-gradient-to-r from-green-600 to-green-400' :
              'bg-gray-600'
            }`}>
              {profile.membership_level.toUpperCase()}
            </span>
            
            {profile.is_verified && (
              <span className="text-2xl" title="Verified">✅</span>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 border border-red-600/30 space-y-4 mb-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-700">
            <span className="text-gray-400">Referral Code</span>
            <span className="font-mono text-red-500 font-bold text-lg">{profile.referral_code}</span>
          </div>
          
          {profile.created_at && (
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-400">Member Since</span>
              <span>{new Date(profile.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <a
            href={`https://t.me/UPCworld_bot?start=${profile.referral_code}`}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
          >
            📱 Connect via Telegram
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
          >
            📋 Share
          </button>
        </div>
      </div>
    </div>
  );
}

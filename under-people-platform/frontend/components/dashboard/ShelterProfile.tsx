'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SITE_URL } from '@/lib/config';
import UserQRCode from './UserQRCode';
import gsap from 'gsap';

export default function ShelterProfile() {
  const { user, isAuthenticated, login } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Имитация входа (для демонстрации, пока нет бэкенда)
  useEffect(() => {
    setTimeout(() => {
      if (!isAuthenticated) {
        // ДЕМО ДАННЫЕ (Удалить при подключении API)
        login({
          id: 'uuid-1234',
          username: 'CyberStalker',
          telegram_id: 12345678,
          up_coins: 666,
          role: 'ranger',
          clan: 'Outcasts',
          ref_code: 'UP-X7Z9',
          avatar_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
          token: 'demo-token'
        });
      }
      setLoading(false);
    }, 1500);
  }, [isAuthenticated, login]);

  // Анимация появления
  useEffect(() => {
    if (!loading && user) {
      gsap.fromTo('.dashboard-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#8A0303] font-mono animate-pulse tracking-widest">
        ESTABLISHING SECURE CONNECTION...
      </div>
    );
  }

  if (!user) return <div className="text-white">ACCESS DENIED</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-7xl mx-auto">
      
      {/* ЛЕВАЯ КОЛОНКА: ID CARD */}
      <div className="dashboard-item lg:w-1/3 bg-[#0a0a0a] border border-[#222] p-8 relative flex flex-col items-center">
        {/* Статус */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-500 font-mono">ONLINE</span>
        </div>

        {/* Аватар */}
        <div className="w-40 h-40 rounded-full border-4 border-[#1a1a1a] overflow-hidden mb-6 relative group">
          <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          <div className="absolute inset-0 bg-[#8A0303]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{user.username}</h2>
        <p className="text-[#8A0303] font-mono text-sm tracking-[0.2em] mb-8">{user.role.toUpperCase()} // {user.clan}</p>

        {/* QR Код */}
        <UserQRCode value={`${SITE_URL}/u/${user.ref_code}`} label="PASS KEY" />
        
        <div className="mt-8 w-full border-t border-[#222] pt-4 text-center">
          <p className="text-zinc-600 text-[10px] font-mono mb-1">REFERRAL CODE</p>
          <p className="text-xl text-white font-mono tracking-widest select-all cursor-pointer hover:text-[#8A0303] transition-colors">
            {user.ref_code}
          </p>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: ДАННЫЕ */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Баланс (Крупно) */}
        <div className="dashboard-item bg-gradient-to-r from-[#140505] to-black border border-[#8A0303]/20 p-8 flex justify-between items-center relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Wallet Balance</h3>
            <div className="text-6xl md:text-7xl font-black text-white flex items-baseline gap-2">
              {user.up_coins} <span className="text-xl text-[#8A0303] font-normal font-mono">UP</span>
            </div>
          </div>
          {/* Фоновый логотип монеты */}
          <div className="absolute -right-10 -bottom-10 text-9xl text-[#8A0303] opacity-5 rotate-12 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
            $
          </div>
          
          <button className="relative z-10 border border-[#8A0303] text-[#8A0303] px-6 py-3 font-mono text-xs uppercase hover:bg-[#8A0303] hover:text-white transition-all">
            Пополнить
          </button>
        </div>

        {/* Сетка статистики */}
        <div className="grid grid-cols-2 gap-6">
          <div className="dashboard-item bg-[#0f0f0f] p-6 border border-[#222] hover:border-[#333] transition-colors">
            <h4 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4">Achievements</h4>
            <div className="flex gap-2">
              {/* Бейджи (заглушки) */}
              <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center text-xs text-zinc-600 border border-[#333]" title="First Blood">🩸</div>
              <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center text-xs text-zinc-600 border border-[#333]" title="Night Owl">🦉</div>
            </div>
          </div>

          <div className="dashboard-item bg-[#0f0f0f] p-6 border border-[#222] hover:border-[#333] transition-colors">
            <h4 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4">Referral Rank</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">Novice</span>
              <span className="text-xs text-zinc-600 mb-1">0/3 to Upgrade</span>
            </div>
            <div className="w-full bg-[#222] h-1 mt-3">
              <div className="w-[10%] h-full bg-[#8A0303]" />
            </div>
          </div>
        </div>

        {/* Лог активности (Стилизация под терминал) */}
        <div className="dashboard-item flex-1 bg-black border border-[#222] p-6 font-mono text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-6 bg-[#111] flex items-center px-4 border-b border-[#222]">
            <span className="text-zinc-500">SYSTEM_LOGS.txt</span>
          </div>
          <div className="mt-6 space-y-2 text-zinc-400 h-32 overflow-y-auto custom-scrollbar">
            <p><span className="text-blue-500">[INFO]</span> Connection established.</p>
            <p><span className="text-green-500">[SUCCESS]</span> Daily bonus +10 UP received.</p>
            <p><span className="text-[#8A0303]">[ALERT]</span> New event "Cyber Halloween" announced.</p>
            <p><span className="text-zinc-600">[SYSTEM]</span> Profile data synced.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

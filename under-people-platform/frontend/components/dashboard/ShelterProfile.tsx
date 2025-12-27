'use client';
import { useAuth } from '@/hooks/useAuth';
import { useSyncBalance } from '@/hooks/useSyncBalance';
import TelegramAuth from '@/components/auth/TelegramAuth';
import UserQRCode from './UserQRCode';
import { SITE_URL } from '@/lib/config';
import gsap from 'gsap';
import { useEffect } from 'react';

export default function ShelterProfile() {
  const { user, isAuthenticated, isHydrated, logout } = useAuth();
  
  // Синхронизируем баланс каждые 30 секунд
  useSyncBalance();

  // Анимация входа
  useEffect(() => {
    if (isAuthenticated && isHydrated) {
      gsap.fromTo('.dashboard-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [isAuthenticated, isHydrated]);

  // Пока грузим данные из localStorage — показываем лоадер
  if (!isHydrated) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600 font-mono animate-pulse tracking-widest text-xs">
        [ СИСТЕМА ЗАГРУЗКИ... ]
      </div>
    );
  }

  // Если не вошел — показываем форму входа
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
            Требуется идентификация
          </h2>
          <p className="text-[#8A0303] font-mono text-xs tracking-[0.3em] uppercase">
            Закрытая территория // Только для членов
          </p>
        </div>
        
        {/* Компонент входа через Telegram */}
        <TelegramAuth />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-7xl mx-auto">
      
      {/* Кнопка выхода (Logout) */}
      <button 
        onClick={logout}
        className="fixed top-6 right-6 z-50 text-[10px] text-zinc-600 hover:text-red-500 font-mono uppercase tracking-widest transition-colors"
      >
        [ Завершить сеанс ]
      </button>

      {/* ЛЕВАЯ КОЛОНКА: ID CARD */}
      <div className="dashboard-item lg:w-1/3 bg-[#0a0a0a] border border-[#222] p-8 relative flex flex-col items-center">
        {/* Статус */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-500 font-mono">ONLINE</span>
        </div>

        {/* Аватар */}
        <div className="w-40 h-40 rounded-full border-4 border-[#1a1a1a] overflow-hidden mb-6 relative group">
          <img 
            src={user?.photo_url || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || 'Member')}&background=8A0303&color=fff`} 
            alt="Avatar" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
          />
          <div className="absolute inset-0 bg-[#8A0303]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{user?.username || 'MEMBER'}</h2>
        <p className="text-[#8A0303] font-mono text-sm tracking-[0.2em] mb-8">{user?.role?.toUpperCase() || 'MEMBER'} // {user.clan || 'UNAFFILIATED'}</p>

        {/* QR Код */}
        <UserQRCode value={`${SITE_URL}/u/${user?.referral_code || user?.ref_code || 'guest'}`} label="ПРОПУСК" />
        
        <div className="mt-8 w-full border-t border-[#222] pt-4 text-center">
          <p className="text-zinc-600 text-[10px] font-mono mb-1">КОД РЕФЕРАЛА</p>
          <p className="text-xl text-white font-mono tracking-widest select-all cursor-pointer hover:text-[#8A0303] transition-colors">
            {user?.ref_code || user?.referral_code || 'UP-GUEST'}
          </p>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: ДАННЫЕ */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Баланс (Крупно) */}
        <div className="dashboard-item bg-gradient-to-r from-[#140505] to-black border border-[#8A0303]/20 p-8 flex justify-between items-center relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Баланс кошелька</h3>
            <div className="text-6xl md:text-7xl font-black text-white flex items-baseline gap-2">
              {user?.up_coins ?? 0} <span className="text-xl text-[#8A0303] font-normal font-mono">UP</span>
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
            <h4 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4">Достижения</h4>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center text-xs text-zinc-600 border border-[#333]" title="First Blood">🩸</div>
              <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center text-xs text-zinc-600 border border-[#333]" title="Night Owl">🦉</div>
            </div>
          </div>

          <div className="dashboard-item bg-[#0f0f0f] p-6 border border-[#222] hover:border-[#333] transition-colors">
            <h4 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4">Ранг рекрутера</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">Новичок</span>
              <span className="text-xs text-zinc-600 mb-1">0/3 до повышения</span>
            </div>
            <div className="w-full bg-[#222] h-1 mt-3">
              <div className="w-[10%] h-full bg-[#8A0303]" />
            </div>
          </div>
        </div>

        {/* Лог активности */}
        <div className="dashboard-item flex-1 bg-black border border-[#222] p-6 font-mono text-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-6 bg-[#111] flex items-center px-4 border-b border-[#222]">
            <span className="text-zinc-500">СИСТЕМНЫЙ_ЖУРНАЛ.log</span>
          </div>
          <div className="mt-6 space-y-2 text-zinc-400 h-32 overflow-y-auto custom-scrollbar">
            <p><span className="text-blue-500">[INFO]</span> Соединение установлено.</p>
            <p><span className="text-green-500">[SUCCESS]</span> Ежедневный бонус +10 UP получен.</p>
            <p><span className="text-[#8A0303]">[ALERT]</span> Новое событие объявлено.</p>
            <p><span className="text-zinc-600">[SYSTEM]</span> Данные профиля синхронизированы.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

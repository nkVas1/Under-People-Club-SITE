'use client';

import { useEffect, useState } from 'react';

export default function PublicProfilePage({ params }: { params: { code: string } }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Demo check: if code starts with UP- or is a valid ref code, show profile
    // In production: fetch from API /api/users/public/{code}
    if (params.code && (params.code.startsWith('UP-') || /^UP[0-9]{4,}$/.test(params.code))) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [params.code]);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="text-[#8A0303] text-2xl font-black tracking-widest">█ █ █</div>
          </div>
          <p className="text-sm text-zinc-500">SCANNING DATABASE...</p>
        </div>
      </div>
    );
  }

  if (isValid === false) {
    return (
      <div className="min-h-screen bg-[#100000] text-red-500 flex items-center justify-center font-mono">
        <div className="border-2 border-red-700 p-8 text-center max-w-md">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-4">ERROR</h1>
          <p className="text-sm mb-4">INVALID OR EXPIRED ACCESS CODE</p>
          <p className="text-xs text-red-700">CODE: {params.code}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Profile Card */}
      <div className="border-2 border-[#8A0303] bg-black p-8 max-w-md w-full relative group">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />

        <div className="text-center relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#222] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${params.code}`}
              alt="Member Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header */}
          <h1 className="text-2xl font-black uppercase tracking-widest mb-2">MEMBER</h1>
          <p className="text-[#8A0303] font-mono text-xs tracking-[0.2em] mb-6">ID: {params.code}</p>

          {/* Status */}
          <div className="bg-[#111] p-4 border border-[#333] mb-4">
            <p className="text-xs text-zinc-500 uppercase mb-1">Verification Status</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-green-500 font-bold tracking-widest uppercase text-sm">VERIFIED</p>
            </div>
          </div>

          {/* Clan Info */}
          <div className="bg-[#111] p-4 border border-[#333] mb-6">
            <p className="text-xs text-zinc-500 uppercase mb-1">Faction</p>
            <p className="text-white font-bold tracking-widest uppercase text-sm">Unaffiliated</p>
          </div>

          {/* Access Badge */}
          <div className="border border-[#8A0303] p-3 bg-[#8A0303]/5">
            <p className="text-xs text-zinc-600 font-mono">This member has verified access</p>
            <p className="text-[10px] text-zinc-500 mt-1">to Under People Club events</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-zinc-600 font-mono space-y-1">
        <p>SECURE DATABASE CONNECTION</p>
        <p className="text-[#8A0303]">VERIFIED TIMESTAMP: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

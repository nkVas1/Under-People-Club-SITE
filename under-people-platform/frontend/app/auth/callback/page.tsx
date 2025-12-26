'use client';
import { Suspense } from 'react';
import AuthCallbackContent from './AuthCallbackContent';

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 text-center space-y-6">
        <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 animate-pulse">
          ESTABLISHING<br />SECURE LINK
        </div>
        <p className="text-[#8A0303] font-mono text-xs tracking-[0.3em] uppercase">
          Neural Interface Active
        </p>
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-[#8A0303] rounded-full animate-pulse" />
          <span className="font-mono text-xs text-zinc-600">[ INITIALIZING... ]</span>
          <div className="w-2 h-2 bg-[#8A0303] rounded-full animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 w-8 h-8 border-2 border-[#8A0303]/20 opacity-50" />
      <div className="absolute top-6 right-6 w-12 h-12 border-2 border-[#8A0303]/10 opacity-30" />
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

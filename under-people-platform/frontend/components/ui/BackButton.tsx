'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.push('/')}
      className="fixed top-8 left-8 z-[100] group flex items-center gap-3 mix-blend-difference"
    >
      <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-sm group-hover:border-[#8A0303] group-hover:bg-[#8A0303]/10 transition-all">
        <span className="text-white text-lg group-hover:-translate-x-1 transition-transform">←</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">System</span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">Main Menu</span>
      </div>
    </button>
  );
}

import UserGrid from '@/components/social/UserGrid';
import BackButton from '@/components/ui/BackButton';

export default function NetworkPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BackButton />
      
      <div className="container mx-auto pt-28 px-6">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-600">
              Network
            </h1>
            <p className="text-[#8A0303] font-mono mt-2 tracking-[0.2em]">NEURAL_NET - SOCIAL GRAPH</p>
          </div>
          <div className="hidden md:block text-right font-mono text-xs text-zinc-500">
            <p>USERS ONLINE: SCANNING</p>
            <p>CLANS: ACTIVE</p>
          </div>
        </header>

        <UserGrid />
      </div>
    </main>
  );
}

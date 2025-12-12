import BackButton from '@/components/ui/BackButton';

export default function ArsenalPage() {
  return (
    <main className="min-h-screen bg-[#080202] text-white">
      <BackButton />
      
      <div className="container mx-auto pt-28 px-6">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
              Arsenal
            </h1>
            <p className="text-[#8A0303] font-mono mt-2 tracking-[0.2em]">OFFICIAL SUPPLY STORE</p>
          </div>
          <div className="hidden md:block text-right font-mono text-xs text-zinc-500">
            <p>STATUS: OPEN</p>
            <p>CONNECTION: SECURE</p>
          </div>
        </header>

        {/* Сетка товаров (будущая) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Здесь будем мапить товары из API */}
          <div className="h-96 border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono animate-pulse">
            [AWAITING SUPPLY DROP...]
          </div>
        </div>
      </div>
    </main>
  );
}

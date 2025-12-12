'use client';

import { Product, useCartStore } from '@/store/cartStore';

export default function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const addItem = useCartStore((state: any) => state.addItem);

  const handleBuy = () => {
    addItem(product);
    alert(`[SYSTEM]: ${product.name} добавлен в инвентарь.`);
  };

  return (
    <div 
      className="group relative bg-[#0f0f0f] border border-[#222] hover:border-[#8A0303] transition-all duration-300 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      {/* Метка категории */}
      <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/80 border border-[#333] text-[10px] font-mono text-zinc-500 uppercase">
        {product.category}
      </div>

      {/* Изображение */}
      <div className="relative h-64 w-full bg-[#151515] overflow-hidden flex items-center justify-center">
        {/* Эффект шума на фоне */}
        <div className="absolute inset-0 opacity-10 bg-[url('/textures/noise.png')]" />
        
        {product.image.startsWith('http') ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="flex items-center justify-center text-zinc-600 font-mono text-xs text-center p-4">
            [{product.name.toUpperCase()}]
          </div>
        )}
        
        {/* Оверлей при наведении */}
        <div className="absolute inset-0 bg-[#8A0303]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Инфо */}
      <div className="p-4 flex flex-col gap-2 relative flex-1">
        {/* Линия сканера */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#8A0303] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <h3 className="text-white font-bold text-lg uppercase tracking-wide truncate">{product.name}</h3>
        
        <div className="flex justify-between items-end mt-auto">
          <div className="font-mono text-[#8A0303] text-xl font-bold">
            {product.price} ₽
          </div>
          <button 
            onClick={handleBuy}
            className="bg-white text-black px-4 py-1 text-xs font-bold uppercase hover:bg-[#8A0303] hover:text-white transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

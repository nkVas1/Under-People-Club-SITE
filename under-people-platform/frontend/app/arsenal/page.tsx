'use client';

import BackButton from '@/components/ui/BackButton';
import ProductCard from '@/components/arsenal/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'ticket' | 'gear' | 'lootbox';
}

const PRODUCTS: Product[] = [
  {
    id: 'ticket_vip',
    name: 'VIP Access Pass',
    price: 2999,
    image: '/img/ticket_vip.jpg',
    category: 'ticket',
  },
  {
    id: 'ticket_standard',
    name: 'Standard Entry',
    price: 999,
    image: '/img/ticket_std.jpg',
    category: 'ticket',
  },
  {
    id: 'hoodie_ranger',
    name: 'Ranger Hoodie',
    price: 1499,
    image: '/img/hoodie_ranger.jpg',
    category: 'gear',
  },
  {
    id: 'mask_anon',
    name: 'Anonymity Mask',
    price: 799,
    image: '/img/mask.jpg',
    category: 'gear',
  },
  {
    id: 'lootbox_mystery',
    name: 'Mystery Lootbox',
    price: 499,
    image: '/img/lootbox.jpg',
    category: 'lootbox',
  },
];

export default function ArsenalPage() {
  const { items, clearCart, total } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Формируем список товаров для Telegram
    const itemsList = items
      .map((item) => `${item.name} (${item.price} UP)`)
      .join('\n');
    const totalPrice = total();

    // Генерируем ссылку на бота с параметрами
    const botDeepLink = `https://t.me/UPCworld_bot?start=pay_${totalPrice}_${items.map((i) => i.id).join('_')}`;

    // Для демо показываем информацию в консоль
    console.log('🛍️ Checkout Info:');
    console.log('Items:', itemsList);
    console.log('Total:', totalPrice, 'UP');
    console.log('Bot Link:', botDeepLink);

    // Открываем ссылку на Telegram бота
    window.open(botDeepLink, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#080202] text-white">
      <BackButton />

      {/* Шумовой оверлей */}
      <div className="fixed inset-0 opacity-5 pointer-events-none mix-blend-overlay">
        <div className="w-full h-full bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/></filter><rect width=%22100%22 height=%22100%22 fill=%22%23fff%22 filter=%22url(%23noise)%22/></svg>')]" />
      </div>

      <div className="container mx-auto pt-28 px-6 relative z-10">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
              Arsenal
            </h1>
            <p className="text-[#8A0303] font-mono mt-2 tracking-[0.2em]">OFFICIAL SUPPLY STORE</p>
          </div>

          {/* Кнопка корзины */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative group cursor-pointer"
          >
            <div className="w-16 h-16 border border-zinc-700 flex items-center justify-center hover:border-[#8A0303] transition-colors duration-300">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">🛒</span>
                {items.length > 0 && (
                  <span className="text-xs font-mono text-[#8A0303]">{items.length}</span>
                )}
              </div>
            </div>
          </button>
        </header>

        {/* Панель корзины */}
        {cartOpen && (
          <div className="mb-12 border border-[#8A0303] bg-[#0a0505] p-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-mono">YOUR CART</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-zinc-500 font-mono">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-2 mb-6 border-b border-zinc-800 pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between font-mono text-sm">
                      <span>{item.name}</span>
                      <span className="text-[#8A0303]">{item.price} UP</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono font-bold text-lg">TOTAL:</span>
                  <span className="font-mono text-2xl font-bold text-[#8A0303]">
                    {total()} UP
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      clearCart();
                      setCartOpen(false);
                    }}
                    className="flex-1 px-4 py-2 border border-zinc-700 font-mono text-sm hover:bg-zinc-900 transition-colors"
                  >
                    CLEAR
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 px-4 py-2 border border-[#8A0303] bg-[#8A0303]/10 font-mono font-bold text-[#8A0303] hover:bg-[#8A0303] hover:text-white transition-all duration-300"
                  >
                    PAY {total()} UP
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Фильтры по категориям */}
        <div className="mb-12">
          <div className="flex gap-4 border-b border-zinc-800 pb-4">
            <button className="font-mono text-sm font-bold text-[#8A0303] border-b-2 border-[#8A0303] pb-2">
              ALL ITEMS
            </button>
            <button className="font-mono text-sm text-zinc-500 hover:text-white transition-colors">
              TICKETS
            </button>
            <button className="font-mono text-sm text-zinc-500 hover:text-white transition-colors">
              GEAR
            </button>
            <button className="font-mono text-sm text-zinc-500 hover:text-white transition-colors">
              LOOTBOXES
            </button>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index} />
          ))}
        </div>

        {/* Нижний баннер */}
        <div className="border border-zinc-800 p-8 mb-16 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <h3 className="text-xl font-mono font-bold mb-4 text-[#8A0303]">⚡ LIMITED TIME OFFER</h3>
          <p className="text-zinc-300 mb-4">
            Every purchase grants access to exclusive events and community features. Your gear
            tells your story.
          </p>
          <p className="text-xs font-mono text-zinc-500">
            All items are instantly delivered upon payment. Join thousands of club members
            worldwide.
          </p>
        </div>

        {/* Информационная секция */}
        <footer className="border-t border-zinc-800 pt-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-mono text-sm font-bold mb-2 text-zinc-400">SECURITY</h4>
              <p className="text-xs text-zinc-500">All transactions encrypted with military-grade protocols</p>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold mb-2 text-zinc-400">PAYMENT</h4>
              <p className="text-xs text-zinc-500">Powered by Telegram Payments. Fast and secure.</p>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold mb-2 text-zinc-400">SUPPORT</h4>
              <p className="text-xs text-zinc-500">24/7 assistance via Telegram bot</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

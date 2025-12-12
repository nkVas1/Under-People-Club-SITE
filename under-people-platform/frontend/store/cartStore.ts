import { create, SetState, GetState } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'ticket' | 'gear' | 'lootbox';
}

interface CartState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set: SetState<CartState>, get: GetState<CartState>) => ({
      items: [],
      addItem: (item: Product) => set((state: CartState) => ({ items: [...state.items, item] })),
      removeItem: (id: string) => set((state: CartState) => ({ 
        items: state.items.filter((i: Product) => i.id !== id) 
      })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum: number, item: Product) => sum + item.price, 0),
    }),
    {
      name: 'up-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

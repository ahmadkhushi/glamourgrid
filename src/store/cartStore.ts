import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const qty = item.quantity ?? 1;
          const existingItem = state.items.find((i) => String(i.id) === String(item.id));
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                String(i.id) === String(item.id)
                  ? { ...i, quantity: (i.quantity ?? 1) + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
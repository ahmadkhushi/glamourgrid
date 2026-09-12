import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PriceState {
  overrides: Record<string, number>; // productId -> price
  setPrice: (id: string, price: number) => void;
  getPrice: (id: string, fallback: number) => number;
}

export const usePriceStore = create<PriceState>()(
  persist(
    (set, get) => ({
      overrides: {},
      setPrice: (id, price) =>
        set((state) => ({ overrides: { ...state.overrides, [id]: price } })),
      getPrice: (id, fallback) => get().overrides[id] ?? fallback,
    }),
    { name: 'glamourgrid-prices' }
  )
);

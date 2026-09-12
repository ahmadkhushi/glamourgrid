import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  clickCount: number;
  setAdmin: (val: boolean) => void;
  incrementClick: () => void;
  resetClicks: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      clickCount: 0,
      setAdmin: (val) => set({ isAdmin: val }),
      incrementClick: () =>
        set((state) => ({ clickCount: state.clickCount + 1 })),
      resetClicks: () => set({ clickCount: 0 }),
    }),
    { name: 'glamourgrid-admin' }
  )
);

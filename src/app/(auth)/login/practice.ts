import { create } from 'zustand';

type Store = {
  count: number;
};

export const useCountStore = create<Store>((set, get) => ({
  count: 0,
  increase: () => {
    set((store) => ({ count: store.count + 1 }));
  },

  decrease: () => {
    set((store) => ({ count: store.count - 1 }));
  },
}));

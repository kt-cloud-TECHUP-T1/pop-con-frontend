import { create } from 'zustand';

interface QueueState {
  drawId: string | null;
  setDrawId: (drawId: string) => void;
  clearDrawId: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  drawId: null,
  setDrawId: (drawId) => set({ drawId }),
  clearDrawId: () => set({ drawId: null }),
}));

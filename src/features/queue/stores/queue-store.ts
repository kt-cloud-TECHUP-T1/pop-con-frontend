import { create } from 'zustand';

interface QueueState {
  drawId: string | null;
  auctionId: string | null;
  setDrawId: (drawId: string) => void;
  clearDrawId: () => void;
  setauctionId: (drawId: string) => void;
  clearauctionId: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  drawId: null,
  setDrawId: (drawId) => set({ drawId }),
  clearDrawId: () => set({ drawId: null }),
  auctionId: null,
  setauctionId: (drawId) => set({ drawId }),
  clearauctionId: () => set({ drawId: null }),
}));

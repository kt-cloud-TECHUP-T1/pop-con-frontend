import { create } from 'zustand';

interface QueueState {
  drawId: string | null;
  setDrawId: (drawId: string) => void;
  clearDrawId: () => void;
  auctionId: string | null;
  setAuctionId: (auctionId: string) => void;
  clearAuctionId: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  drawId: null,
  setDrawId: (drawId) => set({ drawId }),
  clearDrawId: () => set({ drawId: null }),
  auctionId: null,
  setAuctionId: (auctionId) => set({ auctionId }),
  clearAuctionId: () => set({ auctionId: null }),
}));

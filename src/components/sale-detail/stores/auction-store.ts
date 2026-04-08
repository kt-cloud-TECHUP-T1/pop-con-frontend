import { AuctionData } from '@/types/sale-detail';
import { create } from 'zustand';

interface AuctionState {
  liveData: AuctionData | null;
  setLiveAuctionData: (data: AuctionData) => void;
  resetAuctionData: () => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  liveData: null,
  setLiveAuctionData: (data) => set({ liveData: data }),
  resetAuctionData: () => set({ liveData: null }),
}));

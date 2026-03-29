import { AuctionData } from '@/types/sale-detail';
import { create } from 'zustand';

interface AuctionState {
  initialData: AuctionData | null;
  liveData: AuctionData | null;
  setInitialAuctionData: (data: AuctionData) => void;
  setLiveAuctionData: (data: AuctionData) => void;
  resetAuctionData: () => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  initialData: null,
  liveData: null,

  setInitialAuctionData: (data) => set({ initialData: data }),
  setLiveAuctionData: (data) => set({ liveData: data }),
  resetAuctionData: () => set({ initialData: null, liveData: null }),
}));

//초기데이터 라이브데이터 > 사용처에서는 하나로 통일
export const useAuctionLatestData = () =>
  useAuctionStore((state) => state.liveData ?? state.initialData);

import { PopupDetailData } from '@/types/sale-detail';
import { create } from 'zustand';

interface PopupState {
  data: PopupDetailData | null;
  setPopupData: (data: PopupDetailData) => void;
  resetPopupData: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  data: null,
  setPopupData: (data) => set({ data }),
  resetPopupData: () => set({ data: null }),
}));

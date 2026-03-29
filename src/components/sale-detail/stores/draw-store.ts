import { DrawData } from '@/types/sale-detail';
import { create } from 'zustand';

interface DrawState {
  data: DrawData | null;
  setDrawData: (data: DrawData) => void;
  resetDrawData: () => void;
}

export const useDrawStore = create<DrawState>((set) => ({
  data: null,
  setDrawData: (data) => set({ data }),
  resetDrawData: () => set({ data: null }),
}));

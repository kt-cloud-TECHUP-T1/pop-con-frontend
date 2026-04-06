'use client';

import { create } from 'zustand';

type LoginRequiredModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useLoginRequiredModalStore = create<LoginRequiredModalState>()(
  (set) => ({
    isOpen: false,

    open: () =>
      set({
        isOpen: true,
      }),

    close: () =>
      set({
        isOpen: false,
      }),
  })
);

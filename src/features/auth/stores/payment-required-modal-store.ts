'use client';

import { create } from 'zustand';

type PaymentRequiredModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const usePaymentRequiredModalStore = create<PaymentRequiredModalState>()(
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

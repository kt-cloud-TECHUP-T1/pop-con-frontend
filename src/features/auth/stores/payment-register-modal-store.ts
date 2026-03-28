'use client';

import { create } from 'zustand';

type PaymentRegisterModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const usePaymentRegisterModalStore = create<PaymentRegisterModalState>()(
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

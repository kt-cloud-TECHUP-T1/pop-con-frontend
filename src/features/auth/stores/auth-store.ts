'use client';

import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type BillingCard = {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string;
};

type AuthState = {
  accessToken: string | null;
  authStatus: AuthStatus;
  isPaymentRegistered: boolean | null;
  billingCards: BillingCard[];

  setAccessToken: (accessToken: string | null) => void;
  clearAccessToken: () => void;
  setAuthLoading: () => void;

  setPaymentRegistered: (isRegistered: boolean) => void;
  setBillingCards: (cards: BillingCard[]) => void;

  clearPaymentRegistered: () => void;
  clearBillingCards: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: 'tempToken',
  // accessToken: null,
  // authStatus: 'authenticated',
  authStatus: 'loading',
  isPaymentRegistered: false,
  billingCards: [],

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      authStatus: 'authenticated',
    }),

  clearAccessToken: () =>
    set({
      accessToken: null,
      authStatus: 'unauthenticated',
      isPaymentRegistered: null,
      billingCards: [],
    }),

  setAuthLoading: () =>
    set({
      authStatus: 'loading',
    }),

  setPaymentRegistered: (isRegistered) =>
    set({
      isPaymentRegistered: isRegistered,
    }),

  clearPaymentRegistered: () =>
    set({
      isPaymentRegistered: null,
    }),

  setBillingCards: (cards) =>
    set({
      billingCards: cards,
      isPaymentRegistered: cards.length > 0,
    }),

  clearBillingCards: () =>
    set({
      billingCards: [],
      isPaymentRegistered: false,
    }),
}));

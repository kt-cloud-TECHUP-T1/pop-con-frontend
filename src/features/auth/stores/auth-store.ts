'use client';

import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  accessToken: string | null;
  authStatus: AuthStatus;
  isPaymentRegistered: boolean | null;

  setAccessToken: (accessToken: string | null) => void;
  clearAccessToken: () => void;
  setAuthLoading: () => void;

  setPaymentRegistered: (isRegistered: boolean) => void;
  clearPaymentRegistered: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  authStatus: 'loading',
  isPaymentRegistered: null,

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      authStatus: accessToken ? 'authenticated' : 'unauthenticated',
    }),

  clearAccessToken: () =>
    set({
      accessToken: null,
      authStatus: 'unauthenticated',
      isPaymentRegistered: null,
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
}));

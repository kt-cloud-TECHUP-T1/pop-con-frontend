'use client';

import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null, // 처음은 로그인 안 된 상태니 토큰 없음
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAccessToken: () => {
    set({
      accessToken: null,
    });
  },
}));

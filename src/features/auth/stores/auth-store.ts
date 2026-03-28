'use client';
import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Status 에 따른 부분 UI 스켈레톤 처리
// loading : 세션 복구 시도 중
// authenticated : accessToken 있음, 로그인 상태 확정
// unauthenticated : 복구 실패 또는 비로그인 확정

type AuthState = {
  accessToken: string | null;
  authStatus: AuthStatus;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
  setAuthLoading: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  authStatus: 'loading',

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      authStatus: 'authenticated',
    }),

  clearAccessToken: () =>
    set({
      accessToken: null,
      authStatus: 'unauthenticated',
    }),

  setAuthLoading: () =>
    set((state) => ({
      ...state,
      authStatus: 'loading',
    })),
}));

// type AuthState = {
//   accessToken: string | null;
//   setAccessToken: (accessToken: string | null) => void;
//   clearAccessToken: () => void;
// };

// export const useAuthStore = create<AuthState>((set) => ({
//   accessToken: null, // 처음은 로그인 안 된 상태니 토큰 없음
//   setAccessToken: (accessToken) => set({ accessToken }),
//   clearAccessToken: () => {
//     set({
//       accessToken: null,
//     });
//   },
// }));

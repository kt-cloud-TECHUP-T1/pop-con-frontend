import type { AuthStatus } from '@/features/auth/stores/auth-store';

type RequireAuthParams = {
  authStatus: AuthStatus;
  onAuthenticated: () => void;
  onUnauthenticated: () => void;
  onLoading?: () => void;
};
//로그인 여부에 따른 콜백함수 전달
export function requireAuth({
  authStatus,
  onAuthenticated,
  onUnauthenticated,
  onLoading,
}: RequireAuthParams) {
  if (authStatus === 'loading') {
    onLoading?.();
    return;
  }

  if (authStatus === 'unauthenticated') {
    onUnauthenticated();
    return;
  }

  onAuthenticated();
}

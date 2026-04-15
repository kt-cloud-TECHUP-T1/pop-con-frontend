'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { snackbar } from '@/components/ui/snackbar';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';

export function useLogout() {
  const router = useRouter();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  const logout = async () => {
    try {
      const response = await authFetch('/api/auth/logout', {
        method: 'POST',
      });

      const result = (await response.json()) as {
        code: string;
        message: string;
      };

      if (!response.ok) {
        snackbar.destructive({
          title: result.message ?? '로그아웃 중 오류가 발생했습니다.',
        });
        return;
      }

      snackbar.success({ title: result.message ?? '로그아웃되었습니다.' });
      clearAccessToken();
      router.push('/');
    } catch (error) {
      console.error('[logout]', error);
      snackbar.destructive({ title: '로그아웃 중 오류가 발생했습니다.' });
    }
  };

  return { logout };
}

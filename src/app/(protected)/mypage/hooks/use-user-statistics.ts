'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';
import type { ApiResponse } from '@/types/api/common';
import type { UserStatistics } from '@/app/(protected)/mypage/types';

export function useUserStatistics() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<UserStatistics>({
    queryKey: ['users', 'me', 'statistics'],
    queryFn: async () => {
      const response = await authFetch('/api/users/me/statistics');
      if (!response.ok) throw new Error('user statistics fetch failed');
      const result = (await response.json()) as ApiResponse<UserStatistics>;
      return result.data!;
    },
    enabled: !!accessToken,
  });
}

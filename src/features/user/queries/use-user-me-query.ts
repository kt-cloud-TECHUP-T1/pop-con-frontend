'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { getUserMe } from '../api/get-user-me';

export function useUserMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => getUserMe(accessToken!),
    enabled: !!accessToken,
  });
}

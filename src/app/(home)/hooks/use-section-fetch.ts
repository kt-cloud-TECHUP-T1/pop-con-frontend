'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
export const HOME_SECTION_QUERY_KEY = ['home-section'] as const;

export function useSectionFetch<T>(url: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isError } = useQuery({
    queryKey: [...HOME_SECTION_QUERY_KEY, url, accessToken],
    queryFn: async ({ signal }) => {
      const response = await fetch(url, {
        signal,
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`failed to fetch data: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<{ items: T[] }>;
      return result.data?.items ?? [];
    },
  });

  return { data: data ?? null, isError };
}

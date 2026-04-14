'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
import { BaseCardResponse } from '../types';

export const HOME_SECTION_QUERY_KEY = ['home-section'] as const;

export function useSectionFetch<T>(url: string): T[] | null {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data } = useQuery({
    queryKey: [...HOME_SECTION_QUERY_KEY, url, accessToken],
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch(url, {
          signal,
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!response.ok) {
          return [];
        }

        const result = (await response.json()) as ApiResponse<
          BaseCardResponse<T>
        >;
        return result.data?.items ?? [];
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return [];
        }

        return [];
      }
    },
  });

  return data ?? null;
}

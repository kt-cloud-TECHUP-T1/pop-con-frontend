'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
import { BaseCardResponse } from '../types';

export function useSectionFetch<T>(url: string): T[] | null {
  const [items, setItems] = useState<T[] | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!response.ok) {
          setItems([]);
          return;
        }

        const result = (await response.json()) as ApiResponse<BaseCardResponse<T>>;
        setItems(result.data?.items ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setItems([]);
      }
    };

    fetchItems();
    return () => controller.abort();
  }, [accessToken, url]);

  return items;
}

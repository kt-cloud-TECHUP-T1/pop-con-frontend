'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';
import { formatDate, formatWon } from '@/lib/utils';
import type { ApiResponse } from '@/types/api/common';
import type {
  ActivityItem,
  DrawHistoryItem,
} from '@/app/(protected)/mypage/types';
import {
  getDrawStatusFilter,
  getDrawStatusLabel,
  getDrawStatusTone,
} from '@/app/(protected)/mypage/lib/draw-status';

export function toDrawActivityItem(item: DrawHistoryItem): ActivityItem {
  return {
    id: item.id,
    title: item.title,
    image: item.vthumbnailUrl,
    price: formatWon(item.price),
    paidAt: item.paidAt ? formatDate(item.paidAt) : '-',
    stateLabel: getDrawStatusLabel(item.status),
    stateTone: getDrawStatusTone(item.status),
    isResultPending: getDrawStatusFilter(item.status) === 'pendingResult',
  };
}

export function useDrawHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<DrawHistoryItem[]>({
    queryKey: ['history', 'draws'],
    queryFn: async () => {
      const response = await authFetch('/api/history/draws');
      if (!response.ok) throw new Error('draw history fetch failed');
      const result = (await response.json()) as ApiResponse<DrawHistoryItem[]>;
      return result.data ?? [];
    },
    enabled: !!accessToken,
  });
}

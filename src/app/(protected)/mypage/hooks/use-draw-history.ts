'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import type { DrawResult } from '@/app/(protected)/mypage/activity/draws/components/draw-result-modal';
import { snackbar } from '@/components/ui/snackbar';

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

export function useConfirmDrawResult() {
  const queryClient = useQueryClient();

  return useMutation<DrawResult, Error, number>({
    mutationFn: async (entryId: number): Promise<DrawResult> => {
      const response = await authFetch(
        `/api/draws/entries/${entryId}/confirm-result`,
        { method: 'POST' }
      );

      if (response.ok) return 'won';

      const result = (await response.json()) as ApiResponse<null>;
      if (result.code === 'D008') return 'notWon';
      if (result.code === 'D006') throw new Error('RESULT_NOT_READY');

      throw new Error(result.message ?? 'confirm-result failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', 'draws'] });
    },
    onError: (error) => {
      if (error.message === 'RESULT_NOT_READY') {
        snackbar.informative({
          title: '아직 결과 집계 중이에요.',
          description: '잠시 후 다시 확인해주세요.',
        });
        return;
      }
      snackbar.destructive({
        title: '결과 확인에 실패했어요.',
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });
}

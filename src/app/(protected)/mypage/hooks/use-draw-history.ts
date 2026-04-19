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
import type {
  ConfirmDrawResultResponse,
  DrawTicket,
} from '@/types/draw/draw-confirm-result';
import { snackbar } from '@/components/ui/snackbar';

export function toDrawActivityItem(item: DrawHistoryItem): ActivityItem {
  return {
    id: item.id,
    title: item.title,
    image: item.thumbnailUrl,
    price: formatWon(item.price),
    paidAt: item.paidAt ? formatDate(item.paidAt) : '-',
    stateLabel: getDrawStatusLabel(item),
    stateTone: getDrawStatusTone(item),
    isResultPending: getDrawStatusFilter(item) === 'pendingResult',
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

export type ConfirmDrawResultPayload = {
  result: DrawResult;
  winningRatePercent: string | null;
  ticket: DrawTicket | null;
};

const CONFIRM_RESULT_ERROR_MESSAGES: Record<string, string> = {
  D006: '아직 결과 집계 중이에요.',
  D007: '아직 결과 발표 전이에요.',
  T003: '이미 티켓이 발급되었어요.',
  D010: '응모 내역을 찾을 수 없어요.',
};

export function useConfirmDrawResult() {
  const queryClient = useQueryClient();

  return useMutation<ConfirmDrawResultPayload, Error, number>({
    mutationFn: async (entryId: number): Promise<ConfirmDrawResultPayload> => {
      const response = await authFetch(
        `/api/draws/entries/${entryId}/confirm-result`,
        { method: 'POST' }
      );

      const body =
        (await response.json()) as ApiResponse<ConfirmDrawResultResponse | null>;

      if (response.ok && body.data) {
        const { resultType, winningRatePercent, ticket } = body.data;
        const result: DrawResult =
          resultType === 'FAILED'
            ? 'notWon'
            : winningRatePercent
              ? 'lucky'
              : 'won';
        return { result, winningRatePercent, ticket };
      }

      throw new Error(body.code ?? body.message ?? 'CONFIRM_RESULT_FAILED');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', 'draws'] });
    },
    onError: (error) => {
      const description =
        CONFIRM_RESULT_ERROR_MESSAGES[error.message] ??
        '잠시 후 다시 시도해주세요.';
      const isInformative = error.message in CONFIRM_RESULT_ERROR_MESSAGES;

      if (isInformative) {
        snackbar.informative({
          title: '결과를 확인할 수 없어요.',
          description,
        });
        return;
      }
      snackbar.destructive({
        title: '결과 확인에 실패했어요',
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });
}

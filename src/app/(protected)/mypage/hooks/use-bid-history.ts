'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';
import { formatDate, formatWon } from '@/lib/utils';
import type { ApiResponse } from '@/types/api/common';
import type {
  ActivityItem,
  BidHistoryItem,
} from '@/app/(protected)/mypage/types';

export function isBidRefunded(bid: BidHistoryItem) {
  return bid.displayStatus === '환불됨' || bid.displayStatus === 'REFUNDED';
}

export function toBidActivityItem(item: BidHistoryItem): ActivityItem {
  return {
    id: item.id,
    title: item.popupTitle,
    image: item.thumbnailUrl,
    price: formatWon(item.bidPrice),
    paidAt: formatDate(item.paidAt),
    stateLabel: item.displayStatus,
    stateTone: isBidRefunded(item) ? 'danger' : 'success',
  };
}

export function useBidHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<BidHistoryItem[]>({
    queryKey: ['history', 'bids', accessToken],
    queryFn: async () => {
      const response = await authFetch('/api/history/auctions');
      if (!response.ok) throw new Error('bid history fetch failed');
      const result = (await response.json()) as ApiResponse<BidHistoryItem[]>;
      return result.data ?? [];
    },
    enabled: !!accessToken,
  });
}

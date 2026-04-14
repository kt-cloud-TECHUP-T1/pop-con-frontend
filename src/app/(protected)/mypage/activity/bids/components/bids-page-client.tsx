'use client';

import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { BidReviewButton } from '@/app/(protected)/mypage/components/activity-history/bid-review-button';
import { ActivityItemSkeleton } from '../../../components/skeletons';
import {
  useBidHistory,
  toBidActivityItem,
  isBidRefunded,
} from '@/app/(protected)/mypage/hooks/use-bid-history';

export function BidsPageClient() {
  const { data: bids, isLoading, isError } = useBidHistory();

  if (isError) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
        낙찰 내역을 불러오지 못했어요.
      </div>
    );
  }

  if (isLoading) {
    return (
      <ul className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <ActivityItemSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (!bids) return null;

  if (bids.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
        낙찰 내역이 없어요.
      </div>
    );
  }

  const items = bids.map(toBidActivityItem);

  return (
    <ActivityHistoryList
      items={items}
      getPaymentStatusLabel={(item) => item.stateLabel}
      getPriceClassName={(item) => {
        const bid = bids.find((b) => b.id === item.id)!;
        return isBidRefunded(bid)
          ? 'text-[var(--neutral-60)] font-medium line-through'
          : undefined;
      }}
      renderRightContent={(item) => {
        const bid = bids.find((b) => b.id === item.id)!;
        return <BidReviewButton bidId={bid.id} isRefunded={isBidRefunded(bid)} />;
      }}
    />
  );
}

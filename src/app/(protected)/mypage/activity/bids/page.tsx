'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { PageHeader } from '@/components/shared/page-header';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatWon } from '@/lib/utils';
import type { ApiResponse } from '@/types/api/common';
import type { ActivityItem } from '@/app/(protected)/mypage/types';

interface BidHistoryItem {
  id: number;
  thumbnailUrl: string | null;
  popupTitle: string;
  bidPrice: number;
  paidAt: string;
  displayStatus: string;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function BidItemSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 py-2 md:grid-cols-[80px_minmax(0,1fr)_160px_140px_160px] md:items-center md:gap-6">
      <div className="w-20 h-[104px] rounded-[var(--radius-ML)] bg-[var(--neutral-90)]" />
      <div className="h-5 w-2/3 rounded bg-[var(--neutral-90)]" />
      <div className="h-5 w-24 rounded bg-[var(--neutral-90)]" />
      <div className="space-y-1.5">
        <div className="h-4 w-20 rounded bg-[var(--neutral-90)]" />
        <div className="h-3 w-16 rounded bg-[var(--neutral-90)]" />
      </div>
      <div className="h-9 w-[82px] rounded bg-[var(--neutral-90)] md:justify-self-end" />
    </div>
  );
}

export default function MyPageActivityBidsPage() {
  const [bids, setBids] = useState<BidHistoryItem[] | null>(null);
  const [isError, setIsError] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchBids = async () => {
      try {
        const response = await fetch('/api/history/bids', {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          setIsError(true);
          return;
        }

        const result = (await response.json()) as ApiResponse<BidHistoryItem[]>;
        setBids(result.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setIsError(true);
      }
    };

    fetchBids();
    return () => controller.abort();
  }, [accessToken]);

  const isRefunded = (bid: BidHistoryItem) =>
    bid.displayStatus === '환불됨' || bid.displayStatus === 'REFUNDED';

  const items: ActivityItem[] = (bids ?? []).map((bid) => ({
    id: bid.id,
    title: bid.popupTitle,
    price: formatWon(bid.bidPrice),
    paidAt: formatDate(bid.paidAt),
    stateLabel: bid.displayStatus,
    stateTone: isRefunded(bid) ? 'danger' : 'success',
  }));

  return (
    <>
      <PageHeader
        title="낙찰 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      {isError && (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          낙찰 내역을 불러오지 못했어요.
        </div>
      )}

      {!isError && bids !== null && bids.length === 0 && (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          낙찰 내역이 없어요.
        </div>
      )}

      {!isError && bids === null && (
        <ul className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <BidItemSkeleton />
            </li>
          ))}
        </ul>
      )}

      {!isError && bids !== null && bids.length > 0 && (
        <ActivityHistoryList
          items={items}
          getPaymentStatusLabel={(item) => item.stateLabel}
          getPriceClassName={(item) => {
            const bid = bids.find((b) => b.id === item.id)!;
            return isRefunded(bid)
              ? 'text-[var(--neutral-60)] font-medium line-through'
              : undefined;
          }}
          renderRightContent={(item) => {
            const bid = bids.find((b) => b.id === item.id)!;

            if (isRefunded(bid)) {
              return (
                <Button
                  size="small"
                  variant="secondary"
                  disabled
                  className="w-fit min-w-[82px] px-3"
                >
                  <Typography variant="label-3">리뷰 작성</Typography>
                </Button>
              );
            }

            return (
              <Button
                asChild
                size="small"
                variant="primary"
                className="w-fit min-w-[82px] px-3"
              >
                <Link href={`/mypage/activity/reviews/new?bidId=${bid.id}`}>
                  <Typography variant="label-3">리뷰 작성</Typography>
                </Link>
              </Button>
            );
          }}
        />
      )}
    </>
  );
}

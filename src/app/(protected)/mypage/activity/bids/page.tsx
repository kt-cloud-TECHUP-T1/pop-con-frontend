import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ActivityHistoryList } from '@/app/(protected)/mypage/components/activity-history/activity-history-list';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatWon } from '@/lib/utils';
import type { ActivityItem } from '@/app/(protected)/mypage/types';

type ReviewAction = 'write' | 'edit' | 'disabled';

type BidHistoryItem = {
  id: number;
  title: string;
  amount: number;
  purchasedAt: string;
  status: 'paid' | 'refunded';
  reviewAction: ReviewAction;
};

const bidHistory: BidHistoryItem[] = [
  { id: 1, title: 'Title', amount: 125000, purchasedAt: '2026.02.25', status: 'paid', reviewAction: 'write' },
  { id: 2, title: 'Title', amount: 137000, purchasedAt: '2026.01.06', status: 'paid', reviewAction: 'edit' },
  { id: 3, title: 'Title', amount: 169000, purchasedAt: '2026.01.05', status: 'refunded', reviewAction: 'disabled' },
];

const items: ActivityItem[] = bidHistory.map((item) => ({
  id: item.id,
  title: item.title,
  price: formatWon(item.amount),
  paidAt: item.purchasedAt,
  stateLabel: item.status === 'paid' ? '결제 완료' : '환불됨',
  stateTone: item.status === 'refunded' ? 'danger' : 'success',
}));

export default function MyPageActivityBidsPage() {
  return (
    <>
      <PageHeader
        title="낙찰 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <ActivityHistoryList
        items={items}
        getPaymentStatusLabel={(item) => item.stateLabel}
        getPriceClassName={(item) =>
          item.stateLabel === '환불됨'
            ? 'text-[var(--neutral-60)] font-medium line-through'
            : undefined
        }
        renderRightContent={(item) => {
          const bid = bidHistory.find((b) => b.id === item.id)!;

          if (bid.reviewAction === 'disabled') {
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

          const href =
            bid.reviewAction === 'edit'
              ? `/mypage/activity/reviews/${bid.id}/edit`
              : `/mypage/activity/reviews/new?bidId=${bid.id}`;

          return (
            <Button
              asChild
              size="small"
              variant={bid.reviewAction === 'write' ? 'primary' : 'secondary'}
              className="w-fit min-w-[82px] px-3"
            >
              <Link href={href}>
                <Typography variant="label-3">
                  {bid.reviewAction === 'edit' ? '리뷰 수정' : '리뷰 작성'}
                </Typography>
              </Link>
            </Button>
          );
        }}
      />
    </>
  );
}

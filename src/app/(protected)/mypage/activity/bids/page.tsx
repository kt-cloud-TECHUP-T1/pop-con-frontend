import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { ActivityHistoryRow } from '@/app/(protected)/mypage/components/activity-history/activity-history-row';
import { formatWon } from '@/lib/utils';

type BidStatus = 'paid' | 'refunded';
type ReviewAction = 'write' | 'edit' | 'disabled';

type BidHistoryItem = {
  id: number;
  title: string;
  amount: number;
  purchasedAt: string;
  status: BidStatus;
  reviewAction: ReviewAction;
};

const bidHistory: BidHistoryItem[] = [
  {
    id: 1,
    title: 'Title',
    amount: 125000,
    purchasedAt: '2026.02.25',
    status: 'paid',
    reviewAction: 'write',
  },
  {
    id: 2,
    title: 'Title',
    amount: 137000,
    purchasedAt: '2026.01.06',
    status: 'paid',
    reviewAction: 'edit',
  },
  {
    id: 3,
    title: 'Title',
    amount: 169000,
    purchasedAt: '2026.01.05',
    status: 'refunded',
    reviewAction: 'disabled',
  },
];

export default function MyPageActivityBidsPage() {
  return (
    <section className="max-w-[920px]">
      <MyPageHeader
        title="낙찰 내역"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <ul className="space-y-8">
        {bidHistory.map((item) => (
          <li key={item.id}>
            <ActivityHistoryRow
              title={item.title}
              price={formatWon(item.amount)}
              paidAt={item.purchasedAt}
              paymentStatusLabel={item.status === 'paid' ? '결제 완료' : '환불됨'}
              priceClassName={
                item.status === 'refunded'
                  ? 'text-[var(--neutral-60)] font-medium line-through'
                  : undefined
              }
              rightContent={
                <Button
                  size="small"
                  variant={item.reviewAction === 'write' ? 'primary' : 'secondary'}
                  disabled={item.reviewAction === 'disabled'}
                  className="w-fit min-w-[82px] px-3"
                >
                  <Typography variant="label-3">
                    {item.reviewAction === 'edit' ? '리뷰 수정' : '리뷰 작성'}
                  </Typography>
                </Button>
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

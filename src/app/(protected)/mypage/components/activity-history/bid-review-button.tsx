import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type BidReviewButtonProps = {
  bidId: number;
  isRefunded: boolean;
};

export function BidReviewButton({ bidId, isRefunded }: BidReviewButtonProps) {
  if (isRefunded) {
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
      <Link href={`/mypage/activity/reviews/new?bidId=${bidId}`}>
        <Typography variant="label-3">리뷰 작성</Typography>
      </Link>
    </Button>
  );
}

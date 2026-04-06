import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface SaleReviewProps {
  reviewCount: number;
  hasStickyTopBar: boolean;
}

export default function SaleReview({
  reviewCount,
  hasStickyTopBar,
}: SaleReviewProps) {
  return (
    <section
      id="review"
      className={cn(
        'w-full flex flex-col',
        hasStickyTopBar ? 'scroll-mt-20' : 'scroll-mt-8'
      )}
    >
      <div className="flex items-center justify-between">
        <Typography variant="title-1" weight="bold">
          리뷰 <span className="text-[var(--content-low)]">{reviewCount}</span>
        </Typography>
        <Button
          className="text-[var(--content-low)]"
          variant="secondary"
          leftIcon={<Icon name="Write"></Icon>}
        >
          리뷰 쓰기
        </Button>
      </div>
      {reviewCount > 0 ? (
        <div>리뷰있음 UI 작업 추후에 진행</div>
      ) : (
        <div className="flex flex-col items-center pt-ms">
          <Typography variant="body-1" weight="bold">
            아직 작성된 리뷰가 없어요
          </Typography>
          <Typography
            variant="body-2"
            weight="medium"
            className="text-[var(--content-extra-low)] pt-2xs"
          >
            첫 번째 리뷰를 작성해 보세요!
          </Typography>
          <div className="py-s">
            <Button variant="secondary">리뷰 남기기</Button>
          </div>
        </div>
      )}
    </section>
  );
}

import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

interface SaleReviewProps {
  reviewCount: number;
}

export default function SaleReview({ reviewCount }: SaleReviewProps) {
  return (
    <section id="review" className="w-full scroll-mt-24 flex flex-col">
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
        <div>리뷰없음</div>
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

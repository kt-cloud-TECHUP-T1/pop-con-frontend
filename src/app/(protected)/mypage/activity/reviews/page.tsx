'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon/Icon';
import { PageHeader } from '@/components/shared/page-header';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Typography } from '@/components/ui/typography';
import { ThumbnailImage } from '@/components/content/thumbnail-image';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Modal, { ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { snackbar } from '@/components/ui/snackbar';

type ReviewItem = {
  id: number;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  createdAt: string;
  popup: {
    thumbnailUrl?: string;
    title: string;
    description: string;
    caption: string;
  };
};

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    rating: 4,
    title: 'Review Title',
    body: '취소표 잡고 방문한 팝업, 혼자가도 부담없고 가볍게 레고를 만들수 있어서 재미있어요.\n\n단 레고 부품이 몇개 없을수 있는건 카운터 가서 물어보면 찾아주십니다.\n\n구매가능한 레고도 많은데 구입할건 조금 적은편!\n\n추천합니다',
    photos: ['', '', '', '', '', '', '', ''],
    createdAt: '2026.01.06',
    popup: {
      title: 'Title',
      description: 'Sub Text',
      caption: 'Caption',
    },
  },
  {
    id: 2,
    rating: 4,
    title: 'Review Title',
    body: '취소표 잡고 방문한 팝업, 혼자가도 부담없고 가볍게 레고를 만들수 있어서 재미있어요.\n단 레고 부품이 몇개 없을수 있는건 카운터 가서 물어보면 찾아주십니다.\n\n구매가능한 레고도 많은데 구입할건 조금 적은편!\n\n추천합니다',
    photos: ['', '', '', '', '', '', '', ''],
    createdAt: '2025.12.12',
    popup: {
      title: 'Title',
      description: 'Sub Text',
      caption: 'Caption',
    },
  },
];

const arrowClasses = cva(
  'size-12 min-w-auto min-h-auto outline-1 -outline-offset-1 inline-flex justify-center items-center gap-2 overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] bg-white pointer-events-auto',
  {
    variants: {
      position: {
        left: 'left-0 xl:-left-6',
        right: 'right-0 xl:-right-6',
      },
    },
  }
);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="StarFill"
          size={20}
          className={
            i < rating
              ? 'text-[var(--btn-primary-default)]'
              : 'text-[var(--btn-primary-disabled)]'
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onDelete,
}: {
  review: ReviewItem;
  onDelete: (id: number) => void;
}) {
  const router = useRouter();
  const [isMoreContents, setIsMoreContents] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="flex gap-8 py-8 border-b border-Line-Line-3/10 last:border-b-0">
      {/* 좌측: 팝업 카드 */}
      <div className="w-[140px] shrink-0">
        <CardThumbnail
          thumbnailUrl={review.popup.thumbnailUrl}
          thumbnailRatio="3/4"
          title={review.popup.title}
          description={review.popup.description}
          caption={review.popup.caption}
        />
      </div>

      {/* 우측: 리뷰 내용 */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* 별점 */}
        <StarRating rating={review.rating} />

        {/* 리뷰 제목 */}
        <div className="flex items-center justify-between">
          <Typography
            variant="title-1"
            weight="bold"
            className="text-Contents-High"
          >
            {review.title}
          </Typography>
          <div className="flex gap-3 text-sm text-[var(--content-extra-low)]">
            <button
              type="button"
              className="hover:text-[var(--content-high)] transition-colors cursor-pointer"
              onClick={() =>
                router.push(`/mypage/activity/reviews/${review.id}/edit`)
              }
            >
              수정
            </button>
            {/* TODO 삭제 API 연동 시 onClick 작업 */}
            <button
              type="button"
              className="hover:text-[var(--content-high)] transition-colors cursor-pointer"
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제
            </button>
          </div>
        </div>

        {/* 리뷰 본문 */}
        <Typography
          variant="label-1"
          weight="medium"
          className={cn(
            'text-[var(--content-medium)] whitespace-pre-line',
            !isMoreContents && 'line-clamp-3'
          )}
        >
          {review.body}
        </Typography>
        <button
          type="button"
          onClick={() => setIsMoreContents((more) => !more)}
          className="flex items-center self-start"
        >
          <Typography
            variant="label-2"
            className="text-[var(--content-extra-low)]"
          >
            {isMoreContents ? '접기' : '더보기'}
          </Typography>
          <Icon
            name="ChevronDownSmall"
            size={20}
            className={cn(
              'text-[var(--content-extra-low)] transition-transform',
              isMoreContents && 'rotate-180 -mt-[1px]'
            )}
          />
        </button>

        {/* 사진 슬라이드 */}
        <div className="relative">
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent className="ml-0 gap-2">
              {review.photos.map((photo, i) => (
                <CarouselItem key={i} className="basis-auto pl-0">
                  <ThumbnailImage
                    src={photo || undefined}
                    alt={`리뷰 사진 ${i + 1}`}
                    width={200}
                    height={200}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={arrowClasses({ position: 'left' })} />
            <CarouselNext className={arrowClasses({ position: 'right' })} />
          </Carousel>
        </div>

        {/* 날짜 */}
        <Typography
          variant="body-2"
          className="text-[var(--content-extra-low)]"
        >
          {review.createdAt}
        </Typography>
      </div>

      <ReviewDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => onDelete(review.id)}
      />
    </div>
  );
}

function ReviewDeleteModal({
  isOpen,
  onClose,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const handleDelete = () => {
    onDelete();
    onClose();
    snackbar.success({ title: '삭제가 완료되었습니다.' });
  };

  return (
    <Modal
      srTitle="리뷰 삭제"
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
    >
      <div className="flex flex-col items-center text-center">
        <Typography
          variant="title-1"
          weight="bold"
          className="text-[var(--content-high)]"
        >
          리뷰를 삭제하시겠어요?
        </Typography>
        <Typography
          variant="body-1"
          className="mt-2 text-[var(--content-extra-low)]"
        >
          삭제된 리뷰는 다시 복구할 수 없어요
        </Typography>
      </div>
      <ModalFooter className="flex">
        <Button
          size="large"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </Button>
        <Button size="large" className="flex-1" onClick={handleDelete}>
          삭제
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default function MyPageActivityReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  return (
    <section>
      <PageHeader title="내 리뷰" titleVariant="heading-1" titleWeight="bold" />
      <div className="mt-4">
        {reviews.length === 0 ? (
          <div className="min-h-[250px] flex items-center justify-center">
            작성한 리뷰가 없어요.
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}

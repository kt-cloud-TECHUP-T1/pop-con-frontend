'use client';

import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { DutchAuctionSkeleton } from '../components/skeletons';
import { Typography } from '@/components/ui/typography';
import { formatOpenAt } from '@/lib/utils';
import { BasePopupCard } from '../types';
import { useSectionFetch } from '../hooks/use-section-fetch';
import { usePopupLike } from '@/features/popups/hooks/use-popup-like';
import { FetchError } from '@/components/common/fetch-error';
import { NoContent } from '@/components/common/no-content';

const DUTCH_AUCTION_LIMIT = 10;

interface DutchAuctionCard extends BasePopupCard {
  overlay: {
    type: 'AUCTION_IN_PROGRESS' | 'AUCTION_OPEN_AT';
    rank: null;
  };
  phase: {
    type: 'AUCTION';
    status: 'UPCOMING' | 'OPEN' | 'CLOSED';
    openAt: string;
    closeAt: string;
  };
}

export const DutchAuction = () => {
  const { data: dutchAuctionCards, isError } =
    useSectionFetch<DutchAuctionCard>(
      `/api/popups?phaseType=AUCTION&phaseStatus=OPEN,UPCOMING&limit=${DUTCH_AUCTION_LIMIT}`
    );
  const { getLikedPopupState, handleClickLike } =
    usePopupLike<DutchAuctionCard>();
  const router = useRouter();

  if (isError) return <FetchError sectionTitle="더치 경매" />;
  if (dutchAuctionCards === null) return <DutchAuctionSkeleton />;
  if (dutchAuctionCards.length === 0)
    return <NoContent message="진행 중인 경매가 없어요." />;

  const handleClick = (popupId: number) => {
    router.push(`/auction/${popupId}`);
  };

  return (
    <Section
      id="dutch-auction"
      title="더치 경매"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      <GridCarousel
        gridSize={{
          default: 1,
          md: 2,
        }}
        carouselOpts={{ align: 'start', loop: true }}
        alignArrowToRatio="16/9"
        items={dutchAuctionCards.map((dutchAuctionCard) => {
          const likedState = getLikedPopupState(dutchAuctionCard);

          return (
            <div
              key={`dutch-auction-${dutchAuctionCard.popupId}`}
              className="relative"
            >
              <CardThumbnail
                thumbnailUrl={dutchAuctionCard.thumbnailUrl ?? undefined}
                thumbnailRatio="16/9"
                thumbnailClassName={
                  dutchAuctionCard.overlay.type === 'AUCTION_OPEN_AT'
                    ? 'brightness-70'
                    : undefined
                }
                title={dutchAuctionCard.title}
                description={dutchAuctionCard.subText ?? undefined}
                caption={dutchAuctionCard.caption ?? undefined}
                countView={dutchAuctionCard.stats?.viewCount || 0}
                countLike={likedState.likeCount}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => handleClick(dutchAuctionCard.popupId)}
                onClickLike={() => handleClickLike(dutchAuctionCard)}
                isLiked={likedState.isLiked}
                overlayBadge={
                  dutchAuctionCard.overlay.type === 'AUCTION_IN_PROGRESS' ? (
                    <Typography
                      variant="title-2"
                      weight="bold"
                      className="text-white"
                    >
                      경매 진행 중
                    </Typography>
                  ) : undefined
                }
                overlayBadgeBackground="var(--status-warning)"
                overlayBadgeClassName="absolute top-0 left-0 rounded-bl-none rounded-tr-none"
              />
              {dutchAuctionCard.overlay.type === 'AUCTION_OPEN_AT' &&
                (() => {
                  const { datePart, timePart } = formatOpenAt(
                    dutchAuctionCard.phase.openAt
                  );
                  return (
                    <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
                      <Typography variant="title-1">{datePart}</Typography>
                      <Typography variant="display-2" weight="bold">
                        {timePart}
                      </Typography>
                    </div>
                  );
                })()}
            </div>
          );
        })}
      />
    </Section>
  );
};

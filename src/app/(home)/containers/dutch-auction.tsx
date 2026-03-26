'use client';

import { useEffect, useState } from 'react';
import { CardThumbnail } from '@/components/content/card-thumbnail';
import { GridCarousel } from '@/components/content/grid-carousel';
import { Section } from '../components/section';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '@/types/api/common';
import { DutchAuctionSkeleton } from '../components/skeletons';
import { Typography } from '@/components/ui/typography';

interface DutchAuctionCard {
  popupId: number;
  title: string;
  supportingText: null;
  subText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  liked: boolean | null;
  stats: {
    likeCount: number;
    viewCount: number;
  };
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

interface DutchAuctionCardResponse {
  sectionKey: 'AUCTIONS';
  itemCount: number;
  items: DutchAuctionCard[];
}

const formatOpenAt = (openAt: string) => {
  const date = new Date(openAt);
  const datePart = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return { datePart, timePart };
};

export const DutchAuction = () => {
  const [dutchAuctionCards, setDutchAuctionCards] = useState<
    DutchAuctionCard[] | null
  >(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchDutchAuctions = async () => {
      try {
        const response = await fetch(
          '/api/popups?phaseType=AUCTION&phaseStatus=OPEN,UPCOMING&limit=10',
          {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
          }
        );

        if (!response.ok) return;

        const result =
          (await response.json()) as ApiResponse<DutchAuctionCardResponse>;
        setDutchAuctionCards(result.data?.items ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[dutch-auction] 더치 경매 조회 실패', error);
        setDutchAuctionCards([]);
      }
    };
    fetchDutchAuctions();

    return () => controller.abort();
  }, [accessToken]);

  if (dutchAuctionCards === null) return <DutchAuctionSkeleton />;

  const handleClick = (popupId: number) => {
    router.push(`/auction/${popupId}`);
  };

  return (
    <Section
      title="더치 경매"
      showButtonMore
      // TODO 더보기 작업 필요
      // onClickMore={handleClickMore}
    >
      {dutchAuctionCards.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          진행 중인 경매가 없어요.
        </div>
      ) : (
        <GridCarousel
          gridSize={{
            default: 1,
            md: 2,
          }}
          carouselOpts={{ align: 'start' }}
          alignArrowToRatio="16/9"
          items={dutchAuctionCards.map((dutchAuctionCard) => (
            <div key={dutchAuctionCard.popupId} className="relative">
              <CardThumbnail
                thumbnailUrl={dutchAuctionCard.thumbnailUrl ?? undefined}
                thumbnailRatio="16/9"
                title={dutchAuctionCard.title}
                description={dutchAuctionCard.subText ?? undefined}
                caption={dutchAuctionCard.caption ?? undefined}
                countView={dutchAuctionCard.stats.viewCount}
                countLike={dutchAuctionCard.stats.likeCount}
                showButtonLike
                showCountView
                showCountLike
                onClick={() => handleClick(dutchAuctionCard.popupId)}
                // TODO 좋아요 작업 필요
                // onClickLike={() => handleClickLike(dutchAuctionCard.popupId)}
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
          ))}
        />
      )}
    </Section>
  );
};

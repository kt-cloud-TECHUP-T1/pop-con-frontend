'use client';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import SaleInfoPrice from './sale-info-price';
import { SaleDetailSidebarProps, SaleInfoCTAProps } from '@/types/sale-detail';
import SaleInfoCTA from './sale-info-cta';
import { useEffect, useState } from 'react';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';

export default function SaleInfoCard(props: SaleDetailSidebarProps) {
  const {
    phaseType,
    phaseStatus,
    openAt,
    closeAt,
    weekdayOpen,
    weekdayClose,
    weekendOpen,
    weekendClose,
    location,
    popupId,
  } = props;

  const [ConnectedDrawData, setDrawData] = useState<Awaited<
    ReturnType<typeof getDrawDetail>
  > | null>(null);

  useEffect(() => {
    if (phaseType !== 'DRAW' || !popupId) return;

    const fetchDraw = async () => {
      try {
        const data = await getDrawDetail(popupId);
        setDrawData(data);
      } catch (error) {
        throw new Error('DRAW 조회 중 오류가 발생했습니다.');
      }
    };

    fetchDraw();
  }, [phaseType, popupId]);

  const ctaProps: SaleInfoCTAProps =
    phaseType === 'AUCTION'
      ? {
          phaseType: 'AUCTION',
          phaseStatus: phaseStatus,
          serverTime: props.serverTime,
          auctionOpenAt: props.auctionOpenAt,
          auctionStatus: props.auctionStatus,
          buttonStatus: props.buttonStatus,
          connetedDrawOpenAt: ConnectedDrawData?.drawOpenAt ?? null,
        }
      : {
          phaseType: 'DRAW',
          phaseStatus: phaseStatus,
          serverTime: props.serverTime,
          drawOpenAt: props.drawOpenAt,
          drawCloseAt: props.drawCloseAt,
        };

  return (
    <div className="border border-[var(--line-3)] rounded-ml p-ms">
      {phaseType === 'AUCTION' && (
        <SaleInfoPrice
          auctionStatus={props.auctionStatus}
          serverTime={props.serverTime}
          auctionOpenAt={props.auctionOpenAt}
          auctionCloseAt={props.auctionCloseAt}
          remainingUntilOpenSeconds={props.remainingUntilOpenSeconds}
          remainingUntilCloseSeconds={props.remainingUntilCloseSeconds}
          startPrice={props.startPrice}
          minimumPrice={props.minimumPrice}
          currentPrice={props.currentPrice}
          nextPrice={props.nextPrice}
          discountAmount={props.discountAmount}
          priceDropUnit={props.priceDropUnit}
          priceDropIntervalSeconds={props.priceDropIntervalSeconds}
          secondsUntilNextDrop={props.secondsUntilNextDrop}
          maxPurchaseQuantityPerRound={props.maxPurchaseQuantityPerRound}
          canParticipate={props.canParticipate}
        ></SaleInfoPrice>
      )}

      <div
        className={cn(
          'flex flex-col gap-2xs text-[var(--content-extra-low)]',
          phaseType === 'AUCTION' ? 'py-ms' : 'pb-ms'
        )}
      >
        <div className="flex items-center gap-2xs">
          <Icon name="Pin" size={20}></Icon>
          <Typography variant="body-2">{location}</Typography>
        </div>
        <div className="flex items-center gap-2xs">
          <Icon name="Calender" size={20}></Icon>
          <Typography variant="body-2">
            {openAt.replaceAll('-', '.')} - {closeAt.replaceAll('-', '.')}
          </Typography>
        </div>
        <div className="flex items-center gap-2xs">
          <Icon name="Clock" size={20}></Icon>
          <Typography variant="body-2">
            평일 {weekdayOpen} - {weekdayClose} / 주말 {weekendOpen} -{' '}
            {weekendClose}
          </Typography>
        </div>
      </div>
      <SaleInfoCTA {...ctaProps}></SaleInfoCTA>
    </div>
  );
}

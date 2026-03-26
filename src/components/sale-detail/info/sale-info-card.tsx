'use client';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import SaleInfoPrice from './sale-info-price';
import { SaleDetailSidebarProps, SaleInfoCTAProps } from '@/types/sale-detail';
import SaleInfoCTA from './sale-info-cta';
import { useEffect, useState } from 'react';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';
import SaleScheduleInfo from './sale-schedule-info';
import { DrawParticipateButton } from './draw-participate-button';

export default function SaleInfoCard(props: SaleDetailSidebarProps) {
  const { phaseType, phaseStatus, popupId } = props;

  const [ConnectedDrawData, setDrawData] = useState<Awaited<
    ReturnType<typeof getDrawDetail>
  > | null>(null);

  useEffect(() => {
    if (phaseType !== 'AUCTION' || !popupId) return;

    const fetchDraw = async () => {
      try {
        if (!props.connetedDrawId) return;
        const data = await getDrawDetail(String(props.connetedDrawId));
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

      <SaleScheduleInfo {...props}></SaleScheduleInfo>
      <SaleInfoCTA {...ctaProps}></SaleInfoCTA>
    </div>
  );
}

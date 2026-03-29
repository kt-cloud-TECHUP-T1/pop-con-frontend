'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatDateWithWeekdayTime } from '@/lib/utils';
import useCountdown from '../hooks/use-countdown';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLoginRequiredModalStore } from '@/features/auth/stores/login-required-modal-store';
import { requireAuth } from '../utils/require-auth';
import { usePaymentRequiredModalStore } from '@/features/auth/stores/payment-required-modal-store';
import { usePopupStore } from '../stores/popup-store';
import { useAuctionLatestData } from '../stores/auction-store';
import { useDrawStore } from '../stores/draw-store';

export default function SaleInfoCTA() {
  const phaseType = usePopupStore((state) => state.data?.phaseType);

  if (phaseType === 'AUCTION') return <AuctionCTA />;
  if (phaseType === 'DRAW') return <DrawCTA />;
  return null;
}

function AuctionCTA() {
  const auctionData = useAuctionLatestData();
  const drawOpenAt = useDrawStore((state) => state.data?.drawOpenAt);
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.authStatus);
  const openLoginRequiredModal = useLoginRequiredModalStore(
    (state) => state.open
  );
  const isPaymentRegistered = useAuthStore(
    (state) => state.isPaymentRegistered
  );
  const openPaymentRequiredModal = usePaymentRequiredModalStore(
    (state) => state.open
  );

  if (!auctionData) return null;

  const { buttonStatus, auctionOpenAt, auctionId } = auctionData;

  const handleAuctionParticipate = () => {
    requireAuth({
      authStatus,
      onAuthenticated: () => {
        if (isPaymentRegistered === null) return;
        if (!isPaymentRegistered) {
          openPaymentRequiredModal();
          return;
        }
        router.push(`/auction/${auctionId}/reserve`);
      },
      onUnauthenticated: () => openLoginRequiredModal(),
      onLoading: () => {},
    });
  };

  switch (buttonStatus) {
    case 'ENABLED':
      return (
        <Button
          size="large"
          variant="primary"
          className="w-full"
          onClick={handleAuctionParticipate}
        >
          <Typography variant="label-1">프리미엄 경매 참여하기</Typography>
        </Button>
      );
    case 'WAITING':
      return (
        <Button size="large" disabled className="w-full">
          <Typography variant="label-1">
            {formatDateWithWeekdayTime(auctionOpenAt)} 경매오픈
          </Typography>
        </Button>
      );
    case 'SOLD_OUT':
      return (
        <Button size="large" disabled className="w-full">
          <Typography variant="label-1">매진</Typography>
        </Button>
      );
    case 'ENDED':
      return (
        <Button size="large" disabled className="w-full">
          <Typography variant="label-1">
            {drawOpenAt
              ? `${formatDateWithWeekdayTime(drawOpenAt)} 드로우 오픈`
              : '판매 종료'}
          </Typography>
        </Button>
      );
    default:
      return null;
  }
}

function DrawCTA() {
  const drawData = useDrawStore((state) => state.data);

  const remaining = useCountdown(
    drawData?.drawOpenAt ?? '',
    drawData?.serverTime ?? ''
  );
  const isOpen = remaining <= 0;

  if (!drawData) return null;

  return (
    <Button
      size="large"
      variant="primary"
      disabled={!isOpen}
      className="w-full"
    >
      <Typography variant="label-1">
        {isOpen
          ? '드로우 응모하기'
          : formatDateWithWeekdayTime(drawData.drawOpenAt)}
      </Typography>
    </Button>
  );
}

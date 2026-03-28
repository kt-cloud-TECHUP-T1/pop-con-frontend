'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatDateWithWeekdayTime } from '@/lib/utils';
import { DrawSaleInfoCTAProps, SaleInfoCTAProps } from '@/types/sale-detail';
import useCountdown from '../hooks/use-countdown';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLoginRequiredModalStore } from '@/features/auth/stores/login-required-modal-store';
import { requireAuth } from '../utils/require-auth';
import { usePaymentRequiredModalStore } from '@/features/auth/stores/payment-required-modal-store';

export default function SaleInfoCTA(props: SaleInfoCTAProps) {
  const { phaseType, phaseStatus, serverTime } = props;
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
  if (phaseType === 'AUCTION') {
    const {
      auctionOpenAt,
      auctionStatus,
      buttonStatus,
      connetedDrawOpenAt,
      auctionId,
    } = props;

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
        onUnauthenticated: () => {
          openLoginRequiredModal();
        },
        onLoading: () => {
          return;
        },
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
              {connetedDrawOpenAt
                ? `${formatDateWithWeekdayTime(connetedDrawOpenAt)} 드로우 오픈`
                : '판매 종료'}
            </Typography>
          </Button>
        );
      default:
        return null;
    }
  }
  return <DrawCTA {...props} />;
}

function DrawCTA({
  drawOpenAt,
  drawCloseAt,
  serverTime,
  drawId,
}: DrawSaleInfoCTAProps) {
  const remaining = useCountdown(drawOpenAt, serverTime);
  const isOpen = remaining <= 0;

  return (
    <Button
      size="large"
      variant="primary"
      disabled={!isOpen}
      className="w-full"
    >
      <Typography variant="label-1">
        {isOpen ? '드로우 응모하기' : formatDateWithWeekdayTime(drawOpenAt)}
      </Typography>
    </Button>
  );
}

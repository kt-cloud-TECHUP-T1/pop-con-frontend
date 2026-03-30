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
import { enterAuctionQueue } from '@/lib/api/enter-auction-queue';
import { QUEUE_ERROR_MESSAGES } from '@/constants/queue';

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
  const accessToken = useAuthStore((state) => state.accessToken);
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

  const handleAuctionParticipate = async () => {
    requireAuth({
      authStatus,
      onAuthenticated: async () => {
        if (isPaymentRegistered === null) return;
        if (!isPaymentRegistered) {
          openPaymentRequiredModal();
          return;
        }

        // 대기열 진입 api 추가
        const result = await enterAuctionQueue(auctionId, accessToken ?? '');

        switch (result.code) {
          case 'SUCCESS': {
            //queueToken 저장
            sessionStorage.setItem('queueToken', result.data.queueToken);

            if (result.data.status === 'ACTIVE') {
              //보안퀴즈 제공 페이지로 이동??
              router.push(`/auction/${auctionId}/reserve`);
              return;
            }

            if (result.data.status === 'WAITING') {
              router.push(`/queue`);
              // 대기열 페이지 이동
              return;
            }

            return;
          }

          case 'Q001': {
            console.log(result.data.blockedUntil);
            console.log(QUEUE_ERROR_MESSAGES[result.code]);
            return;
          }

          case 'C001':
          case 'A002':
          case 'A003':
          case 'S001': {
            console.log(QUEUE_ERROR_MESSAGES[result.code]);
            return;
          }
        }
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

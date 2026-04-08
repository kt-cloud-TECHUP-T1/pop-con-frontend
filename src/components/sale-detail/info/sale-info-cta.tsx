'use client';

import useCountdown from '../hooks/use-countdown';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatDateWithWeekdayTime } from '@/lib/utils';
import { useDetailPageCollector } from '@/features/anti-macro';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useLoginRequiredModalStore } from '@/features/auth/stores/login-required-modal-store';
import { requireAuth } from '../utils/require-auth';
import { usePaymentRequiredModalStore } from '@/features/auth/stores/payment-required-modal-store';
import { useAuctionStore } from '../stores/auction-store';
import { enterAuctionQueue } from '@/lib/api/enter-auction-queue';
import { QUEUE_ERROR_MESSAGES } from '@/constants/queue';
import { snackbar } from '@/components/ui/snackbar';
import { queueTokenStorage } from '@/features/queue/utils/queue-token';
import { useQueueStore } from '@/features/queue/stores/queue-store';
import { QueueEntryResponse } from '@/features/queue/types/queue';
import { usePopupDetailQuery } from '../queries/use-popup-detail-query';
import { useCurrentDrawDetail } from '../queries/use-current-draw-detail';
import { getDrawDetail } from '@/app/api/sale-detail/get-draw-detail';
import { useQuery } from '@tanstack/react-query';

export default function SaleInfoCTA() {
  const params = useParams<{ popupId: string }>();
  const popupIdNumber = Number(params.popupId);
  const { data: popupData } = usePopupDetailQuery(popupIdNumber);
  const page =
    popupData?.phaseType === 'AUCTION'
      ? ('dutch-auction-detail' as const)
      : ('popup-detail' as const);
  const { submitSignals } = useDetailPageCollector({ page });

  if (popupData?.phaseType === 'AUCTION')
    return (
      <AuctionCTA
        onSubmitSignals={submitSignals}
        drawId={popupData.drawId as number}
      />
    );
  if (popupData?.phaseType === 'DRAW')
    return <DrawCTA onSubmitSignals={submitSignals} />;
  return null;
}

function AuctionCTA({
  onSubmitSignals,
  drawId,
}: {
  onSubmitSignals: () => Promise<void>;
  drawId: number;
}) {
  const auctionData = useAuctionStore((state) => state.liveData);
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.authStatus);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuctionId = useQueueStore((state) => state.setAuctionId);
  const shouldFetchDraw = auctionData?.auctionStatus === 'CLOSED';

  const {
    data: drawData,
    isPending: isDrawPending,
    isError: isDrawError,
    error: drawError,
  } = useQuery({
    queryKey: ['draw-detail', drawId],
    queryFn: () => getDrawDetail(drawId!),
    enabled: shouldFetchDraw,
  });

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
        //간편결제 상태 모름
        if (isPaymentRegistered === null) {
          return;
        }
        //간편결제 등록 안됐을경우 결제모달 오픈
        if (isPaymentRegistered === false) {
          openPaymentRequiredModal();
          return;
        }

        onSubmitSignals();
        // 대기열 진입 api 추가
        const result = await enterAuctionQueue(auctionId, accessToken ?? '');

        switch (result.code) {
          case 'SUCCESS': {
            //queueToken 저장 (대기열 페이지에서 풀링 및 삭제용)
            queueTokenStorage.save(result.data.queueToken);

            if (result.data.status === 'ACTIVE') {
              //퀴즈페이지로 이동
              router.push('/security-quiz');
              return;
            }

            if (result.data.status === 'WAITING') {
              //재진입시 api 전달용
              sessionStorage.setItem(
                'queue_auction_id',
                String(auctionData.auctionId)
              );
              //큐스토어에 auctionId 저장 새로고침시 재진입 확인용
              setAuctionId(String(auctionData.auctionId));
              router.push('/queue');
              // 대기열 페이지 이동
              return;
            }

            return;
          }
          case 'Q001': {
            const msg = result.data.blockedUntil;
            snackbar.destructive({
              title: msg
                ? `${msg}까지 접근이 제한되었습니다.`
                : (result.message ?? '접근이 제한되었습니다.'),
            });

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
      //로그인 유도 모달 오픈
      onUnauthenticated: () => {
        console.log('로그인 모달 오픈');
        openLoginRequiredModal();
      },
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
            {drawData?.drawOpenAt
              ? `${formatDateWithWeekdayTime(drawData?.drawOpenAt)} 드로우 오픈`
              : '판매 종료'}
          </Typography>
        </Button>
      );
    default:
      return null;
  }
}

function DrawCTA({
  onSubmitSignals,
}: {
  onSubmitSignals: () => Promise<void>;
}) {
  const { data: drawData } = useCurrentDrawDetail();
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.authStatus);
  const accessToken = useAuthStore((state) => state.accessToken);
  const openLoginRequiredModal = useLoginRequiredModalStore(
    (state) => state.open
  );
  const setDrawId = useQueueStore((state) => state.setDrawId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openRemaining = useCountdown(
    drawData?.drawOpenAt ?? '',
    drawData?.serverTime ?? ''
  );

  const closeRemaining = useCountdown(
    drawData?.drawCloseAt ?? '',
    drawData?.serverTime ?? ''
  );

  const handleDrawParticipate = async () => {
    requireAuth({
      authStatus,
      onAuthenticated: async () => {
        if (!drawData) return;

        setIsSubmitting(true);
        await onSubmitSignals();

        try {
          const response = await fetch(`/api/queue/draws/${drawData.drawId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const result = (await response.json()) as QueueEntryResponse;

          if (!response.ok || !result.data) {
            snackbar.destructive({
              title:
                result.message ??
                '드로우 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
            return;
          }

          const { status } = result.data;

          if (status !== 'BLOCKED' && 'queueToken' in result.data) {
            queueTokenStorage.save(result.data.queueToken);
          }

          const statusHandler: Record<string, () => void> = {
            ACTIVE: () => router.push('/security-quiz'),
            WAITING: () => {
              sessionStorage.setItem('queue_draw_id', String(drawData.drawId));
              setDrawId(String(drawData.drawId));
              router.push('/queue');
            },
            BLOCKED: () => {
              const msg =
                result.data?.status === 'BLOCKED'
                  ? result.data.blockedUntil
                  : null;
              snackbar.destructive({
                title: msg
                  ? `${msg}까지 접근이 제한되었습니다.`
                  : (result.message ?? '접근이 제한되었습니다.'),
              });
            },
          };

          const handler = statusHandler[status];
          if (handler) {
            handler();
          } else {
            snackbar.destructive({
              title: '드로우 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
          }
        } catch (error) {
          console.error('[DrawCTA/handleDrawParticipate]', error);
          snackbar.destructive({
            title: '드로우 신청에 실패했습니다. 잠시 후 다시 시도해주세요.',
          });
        } finally {
          setIsSubmitting(false);
        }
      },
      //로그인 유도 모달 오픈
      onUnauthenticated: () => openLoginRequiredModal(),
      onLoading: () => {},
    });
  };

  const status =
    openRemaining > 0 ? 'UPCOMING' : closeRemaining > 0 ? 'OPEN' : 'CLOSED';

  const isOpen = status === 'OPEN';

  return (
    <Button
      size="large"
      variant="primary"
      disabled={!isOpen || isSubmitting}
      className="w-full"
      onClick={handleDrawParticipate}
    >
      <Typography variant="label-1">
        {status === 'UPCOMING' &&
          `${formatDateWithWeekdayTime(drawData?.drawOpenAt ?? '')} 드로우 오픈`}
        {status === 'OPEN' && '드로우 응모하기'}
        {status === 'CLOSED' && '응모 마감'}
      </Typography>
    </Button>
  );
}

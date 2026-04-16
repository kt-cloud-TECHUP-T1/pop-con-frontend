'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import { Wrapper } from '@/components/layout/wrapper';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { snackbar } from '@/components/ui/snackbar';
import { formatEntryDate, formatEntryTime, formatWon } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { AuctionReservationSuccessDetail } from '@/types/auction/auction-success';
import { getAuctionReservation } from '@/features/auction-success/get-auction-reservation';
import {
  AUCTION_RESERVATION_ERROR_MESSAGES,
  DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE,
} from '@/constants/auction-success-reservation';

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams<{ popupId: string; reservationId: string }>();
  const accessToken = useAuthStore((state) => state.accessToken);

  const popupId = params.popupId;
  const reservationId = params.reservationId;

  const [reservationDetail, setReservationDetail] =
    useState<AuctionReservationSuccessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId || !accessToken) {
      return;
    }

    const fetchReservationDetail = async () => {
      setIsLoading(true);

      try {
        const result = await getAuctionReservation(reservationId, accessToken);

        if (result.code === 'SUCCESS') {
          setReservationDetail(result.data);
          setErrorMessage(null);
          return;
        }

        const message =
          AUCTION_RESERVATION_ERROR_MESSAGES[result.code] ??
          DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE;

        setReservationDetail(null);
        setErrorMessage(message);

        snackbar.destructive({
          title: '조회 실패',
          description: message,
        });
      } catch {
        setReservationDetail(null);
        setErrorMessage(DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE);

        snackbar.destructive({
          title: '조회 실패',
          description: DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationDetail();
  }, [reservationId, accessToken]);

  const handleDetailClick = () => {
    // if (!popupId || !reservationId) return;
    // router.push(`/auction/${popupId}/success/${reservationId}`);
    //낙찰 상세보기 예정
  };

  if (isLoading) {
    return (
      <Wrapper className="py-3xl max-w-[762px]">
        <div className="flex flex-col gap-m w-full">
          <div className="flex flex-col gap-xs items-center">
            <Icon
              name="CircleCheckFill"
              size={72}
              className="text-[var(--btn-primary-default)]"
            />
            <Typography variant="heading-1" weight="bold">
              낙찰 완료
            </Typography>
            <Typography
              variant="body-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              예약 정보를 불러오는 중입니다.
            </Typography>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (errorMessage || !reservationDetail) {
    return (
      <Wrapper className="py-3xl max-w-[762px]">
        <div className="flex flex-col gap-m w-full">
          <div className="flex flex-col gap-xs items-center">
            <Typography variant="heading-1" weight="bold">
              예약 정보 조회 실패
            </Typography>
            <Typography
              variant="body-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              {errorMessage ?? DEFAULT_AUCTION_RESERVATION_ERROR_MESSAGE}
            </Typography>
          </div>

          <div className="flex gap-xs">
            <Link href="/" className="flex-1">
              <Button className="w-full" variant="secondary">
                <Typography variant="label-1" weight="medium">
                  홈으로 돌아가기
                </Typography>
              </Button>
            </Link>
            <Button className="flex-1" onClick={() => router.back()}>
              <Typography variant="label-1" weight="medium">
                이전 페이지로
              </Typography>
            </Button>
          </div>
        </div>
      </Wrapper>
    );
  }

  const entrySchedule = `${formatEntryDate(
    reservationDetail.entryDate
  )} ${formatEntryTime(reservationDetail.entryTime)}`;

  return (
    <Wrapper className="py-3xl max-w-[762px]">
      <div className="flex flex-col gap-m w-full">
        <div className="flex flex-col gap-xs items-center">
          <Icon
            name="CircleCheckFill"
            size={72}
            className="text-[var(--btn-primary-default)]"
          />
          <Typography variant="heading-1" weight="bold">
            낙찰 완료
          </Typography>
          <Typography
            variant="body-1"
            weight="regular"
            className="text-[var(--content-extra-low)]"
          >
            티켓 구매가 성공적으로 완료되었습니다.
          </Typography>
        </div>

        <div className="flex flex-col gap-xs">
          <Box
            padding="MS"
            border="var(--line-3)"
            radius="MS"
            className="flex flex-col gap-ms"
          >
            <Typography variant="title-2" weight="bold">
              주문 내역
            </Typography>

            <div>
              <div className="pb-s border-b border-[var(--line-3)]">
                <Typography
                  variant="caption-1"
                  weight="regular"
                  className="text-[var(--content-extra-low)]"
                >
                  예약번호 : {reservationDetail.reservationNo}
                </Typography>
              </div>

              <div className="pt-s flex gap-s">
                <div className="relative w-[60px] aspect-[3/4] rounded-[8px] border overflow-hidden">
                  <Image
                    src={reservationDetail.popupThumbnail}
                    alt={reservationDetail.popupTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <Typography
                    variant="body-1"
                    weight="bold"
                    className="pb-[8px]"
                  >
                    {reservationDetail.popupTitle}
                  </Typography>

                  <Typography
                    variant="caption-1"
                    weight="regular"
                    className="text-[var(--content-extra-low)]"
                  >
                    {entrySchedule}
                  </Typography>

                  <Typography
                    variant="caption-1"
                    weight="regular"
                    className="text-[var(--content-extra-low)] pt-[4px]"
                  >
                    {reservationDetail.popupAddress}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          <Box padding="MS" border="var(--line-3)" radius="MS">
            <Typography variant="title-2" weight="bold">
              결제 금액
            </Typography>

            <div className="pt-ms text-[var(--content-extra-low)]">
              <div className="flex items-center justify-between pb-xs">
                <Typography variant="body-1" weight="regular">
                  시작가
                </Typography>
                <Typography variant="body-1" weight="regular">
                  {formatWon(reservationDetail.startPrice)}
                </Typography>
              </div>

              <div className="flex items-center justify-between pb-s">
                <Typography variant="body-1" weight="regular">
                  할인 금액
                </Typography>
                <Typography variant="body-1" weight="regular">
                  {formatWon(reservationDetail.discountAmount)}
                </Typography>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--line-line-1,#E5E5E5)] pt-s">
                <Typography
                  variant="body-1"
                  weight="bold"
                  className="text-[black]"
                >
                  최종 낙찰 금액
                </Typography>
                <Typography
                  variant="body-1"
                  weight="bold"
                  className="text-[var(--btn-primary-default)]"
                >
                  {formatWon(reservationDetail.finalPrice)}
                </Typography>
              </div>
            </div>
          </Box>
        </div>

        <div className="flex gap-xs">
          <Link href="/" className="flex-1">
            <Button className="w-full" variant="secondary">
              <Typography variant="label-1" weight="medium">
                홈으로 돌아가기
              </Typography>
            </Button>
          </Link>

          <Button className="flex-1" onClick={handleDetailClick}>
            <Typography variant="label-1" weight="medium">
              낙찰 상세 보기
            </Typography>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}

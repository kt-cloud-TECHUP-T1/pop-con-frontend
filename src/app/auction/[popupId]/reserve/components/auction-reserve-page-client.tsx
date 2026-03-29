'use client';

import SaleInfoPrice from '@/components/sale-detail/info/sale-info-price';
import ReservePaymentSection from './reserve-payment-section';
import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { ReserveCalendarSection } from './reserve-calendar-section';
import { ReserveTimeSlotSection } from './reserve-time-slot-section';
import { Box } from '@/components/ui/box';
import { AuctionInfoContent } from '@/constants/sale-detail';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ReservePanelSkeleton } from '@/components/sale-detail/reserve-panel-skeleton';
import { AuctionData } from '@/types/sale-detail';

export interface AuctionSlot {
  optionId: number;
  entryTime: string;
  remainingStock: number;
  selectable: boolean;
}

interface AuctionReservePageClientProps {
  auctionId: string;
}

const DEFAULT_DATES_ERROR =
  '예약 가능 날짜를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
const DEFAULT_SLOTS_ERROR =
  '회차 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';

export function AuctionReservePageClient(props: AuctionData) {
  const { auctionId } = props;
  const accessToken = useAuthStore((state) => state.accessToken);
  // 첫 진입 시에는 아무 날짜도 선택하지 않은 상태로 시작
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<AuctionSlot[]>([]);
  const [datesErrorMessage, setDatesErrorMessage] = useState<string | null>(
    null
  );
  const [slotsErrorMessage, setSlotsErrorMessage] = useState<string | null>(
    null
  );
  const [isDatesLoading, setIsDatesLoading] = useState(false);

  // ====================== 페이지 진입 시 선택 가능한 날짜 목록 조회
  useEffect(() => {
    // TODO 테스트 후 주석 제거
    if (!accessToken) return;

    const fetchDates = async () => {
      setIsDatesLoading(true);
      try {
        const response = await fetch(`/api/auctions/${auctionId}/dates`, {
          headers: {
            // TODO 테스트 후 주석 제거
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          const AU_ERROR_CODES = ['AU001', 'AU002', 'AU003'];

          setAvailableDates([]);
          setDatesErrorMessage(
            AU_ERROR_CODES.includes(result.code)
              ? result.message
              : DEFAULT_DATES_ERROR
          );

          return;
        }

        setDatesErrorMessage(null);
        setAvailableDates(
          result.data?.map((date: { entryDate: string }) => date.entryDate) ??
            []
        );
      } catch (error) {
        console.error('[auction/fetchDates]', error);
        setAvailableDates([]);
        setDatesErrorMessage(DEFAULT_DATES_ERROR);
      } finally {
        setIsDatesLoading(false);
      }
    };
    fetchDates();
  }, [auctionId, accessToken]);

  // ====================== 날짜 선택 시 해당 날짜의 회차 목록 조회
  useEffect(() => {
    // TODO 테스트 후 주석 제거
    if (!accessToken || !selectedDate) return;
    if (!selectedDate) return;

    const fetchDatesOptions = async () => {
      setSlots([]);
      setSlotsErrorMessage(null);
      try {
        const response = await fetch(
          `/api/auctions/${auctionId}/dates/${selectedDate}/options`,
          // TODO 테스트 후 주석 제거
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const result = await response.json();

        if (!response.ok) {
          const AU_ERROR_CODES = ['AU001', 'AU002', 'AU003'];

          setAvailableDates([]);
          setDatesErrorMessage(
            AU_ERROR_CODES.includes(result.code)
              ? result.message
              : DEFAULT_SLOTS_ERROR
          );

          return;
        }

        setSlotsErrorMessage(null);
        setSlots(result.data ?? []);
      } catch (error) {
        console.error('[auction/fetchDatesOptions]', error);
      }
    };
    fetchDatesOptions();
  }, [auctionId, selectedDate, accessToken]);

  return (
    <section className="flex flex-col gap-8">
      {/* 페이지 제목/설명 */}
      <div className="flex flex-col gap-xs">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)]"
        >
          티켓 결제
        </Typography>
        <Typography
          variant="body-1"
          className="text-[var(--content-extra-low)]"
        >
          원하는 날짜와 시간을 선택하고 실시간 할인가로 티켓을 구매하세요
        </Typography>
      </div>

      <div className="grid gap-[54px] xl:grid-cols-[minmax(0,1fr)_384px]">
        {/* 좌측 메인 패널: 날짜 선택 + 회차 선택 */}
        <Box radius="ML" border="#0A0A0A14" padding="M" className="min-w-0">
          {isDatesLoading ? (
            <ReservePanelSkeleton />
          ) : (
            <>
              {/* 날짜 선택 목록 */}
              <ReserveCalendarSection
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedOptionId(null);
                }}
                errorMessage={datesErrorMessage}
              />

              {/* 경매 자체 에러 시 회차 섹션 숨김 */}
              {!datesErrorMessage && (
                <div className="mt-14">
                  <ReserveTimeSlotSection
                    selectedDate={selectedDate}
                    selectedOptionId={selectedOptionId}
                    slots={slots}
                    onSelectSlot={setSelectedOptionId}
                    errorMessage={slotsErrorMessage}
                  />
                </div>
              )}
            </>
          )}
        </Box>

        {/* 우측 결제 요약 패널 */}
        <aside className="flex flex-col gap-s">
          <Box radius="ML" border="#0A0A0A14" padding="MS" className="min-w-0">
            <SaleInfoPrice {...props}></SaleInfoPrice>
            <ReservePaymentSection
              selectedOptionId={selectedOptionId}
              bidPrice={props.currentPrice}
            ></ReservePaymentSection>
          </Box>
          <SaleNoticeCard items={AuctionInfoContent} />
        </aside>
      </div>
    </section>
  );
}

'use client';

import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import SaleAuctionReserveSidebar from '@/components/sale-detail/info/SaleAuctionReserveSidebar';
import { Typography } from '@/components/ui/typography';
import { Box } from '@/components/ui/box';
import { AuctionInfoContent } from '@/constants/sale-detail';
import { ReservePanelSkeleton } from '@/features/reserve/components/reserve-panel-skeleton';
import { ReserveCalendarSection } from '@/features/reserve/components/reserve-calendar-section';
import { ReserveTimeSlotSection } from '@/features/reserve/components/reserve-time-slot-section';
import { ReserveTimeSlotCard } from '@/features/reserve/components/reserve-time-slot-card';
import { useReserveDateSlots } from '@/features/reserve/hooks/use-reserve-date-slots';
import type { AuctionSlot } from '@/features/reserve/types/reserve';

interface AuctionReservePageClientProps {
  auctionId: number;
}

const AU_ERROR_CODES = ['AU001', 'AU002', 'AU003'];

export function AuctionReservePageClient({
  auctionId,
}: AuctionReservePageClientProps) {
  const {
    selectedDate,
    setSelectedDate,
    availableDates,
    selectedOptionId,
    setSelectedOptionId,
    slots,
    datesErrorMessage,
    slotsErrorMessage,
    isDatesLoading,
    isSlotsLoading,
  } = useReserveDateSlots<AuctionSlot>({
    datesUrl: `/api/auctions/${auctionId}/dates`,
    errorCodes: AU_ERROR_CODES,
  });

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
                    isLoading={isSlotsLoading}
                    renderSlot={(slot, isSelected) => (
                      <ReserveTimeSlotCard
                        variant="auction"
                        slot={slot}
                        isSelected={isSelected}
                        onSelect={setSelectedOptionId}
                      />
                    )}
                  />
                </div>
              )}
            </>
          )}
        </Box>

        {/* 우측 결제 요약 패널 */}
        <aside className="flex flex-col gap-s">
          <Box radius="ML" border="#0A0A0A14" padding="MS" className="min-w-0">
            <SaleAuctionReserveSidebar
              auctionId={auctionId}
              selectedOptionId={selectedOptionId}
            ></SaleAuctionReserveSidebar>
          </Box>
          <SaleNoticeCard items={AuctionInfoContent} />
        </aside>
      </div>
    </section>
  );
}

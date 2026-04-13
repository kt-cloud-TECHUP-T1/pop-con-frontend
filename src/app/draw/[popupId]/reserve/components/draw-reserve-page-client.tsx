// 드로우 상세

'use client';

import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import DrawApplySection from './draw-apply-section';
import { Typography } from '@/components/ui/typography';
import { Box } from '@/components/ui/box';
import { DrawInfoContent } from '@/constants/sale-detail';
import { ReservePanelSkeleton } from '@/features/reserve/components/reserve-panel-skeleton';
import { ReserveCalendarSection } from '@/features/reserve/components/reserve-calendar-section';
import { ReserveTimeSlotSection } from '@/features/reserve/components/reserve-time-slot-section';
import { ReserveTimeSlotCard } from '@/features/reserve/components/reserve-time-slot-card';
import { useReserveDateSlots } from '@/features/reserve/hooks/use-reserve-date-slots';
import type { DrawSlot } from '@/features/reserve/types/reserve';

interface DrawReservePageClientProps {
  drawId: string;
}

const D_ERROR_CODES = ['D001', 'D002', 'D003'];

export function DrawReservePageClient({ drawId }: DrawReservePageClientProps) {
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
  } = useReserveDateSlots<DrawSlot>({
    datesUrl: `/api/draws/${drawId}/dates`,
    errorCodes: D_ERROR_CODES,
  });

  const selectedSlot = slots.find((slot) => slot.optionId === selectedOptionId);

  return (
    <section className="flex flex-col gap-8">
      {/* 페이지 제목/설명 */}
      <div className="flex flex-col gap-xs">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)]"
        >
          드로우 신청
        </Typography>
        <Typography
          variant="body-1"
          className="text-[var(--content-extra-low)]"
        >
          원하는 날짜와 시간을 선택하고 드로우를 신청하세요
        </Typography>
      </div>

      <div className="grid gap-[54px] xl:grid-cols-[minmax(0,1fr)_360px]">
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

              {/* 신청 자체 에러 시 회차 섹션 숨김 */}
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
                        variant="draw"
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

        {/* 우측 신청 요약 패널 */}
        <aside className="flex flex-col gap-s">
          <Box radius="ML" border="#0A0A0A14" padding="MS" className="min-w-0">
            <DrawApplySection
              drawId={drawId}
              selectedOptionId={selectedOptionId}
              selectedDate={selectedDate}
              selectedEntryTime={selectedSlot?.entryTime ?? null}
            />
          </Box>
          <SaleNoticeCard items={DrawInfoContent} />
        </aside>
      </div>
    </section>
  );
}

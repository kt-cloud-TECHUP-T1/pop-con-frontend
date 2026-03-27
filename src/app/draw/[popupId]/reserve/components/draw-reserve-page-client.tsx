// 드로우 상세

'use client';

import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { ReserveCalendarSection } from '@/app/auction/[popupId]/reserve/components/reserve-calendar-section';
import { DrawTimeSlotSection } from './draw-time-slot-section';
import { Box } from '@/components/ui/box';
import { DrawInfoContent } from '@/constants/sale-detail';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import DrawApplySection from './draw-apply-section';
import SaleInfoPrice from '@/components/sale-detail/info/sale-info-price';
import { ReservePanelSkeleton } from '@/components/sale-detail/reserve-panel-skeleton';

export interface DrawSlot {
  optionId: number;
  entryTime: string;
}

interface DrawReservePageClientProps {
  drawId: string;
}

export function DrawReservePageClient({ drawId }: DrawReservePageClientProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<DrawSlot[]>([]);
  const [datesErrorMessage, setDatesErrorMessage] = useState<string | null>(
    null
  );
  const [slotsErrorMessage, setSlotsErrorMessage] = useState<string | null>(
    null
  );
  const [isDatesLoading, setIsDatesLoading] = useState(true);

  // ====================== 페이지 진입 시 선택 가능한 날짜 목록 조회
  useEffect(() => {
    // TODO 테스트 후 주석 제거
    // if (!accessToken) return;

    const fetchDates = async () => {
      setIsDatesLoading(true);
      try {
        const response = await fetch(`/api/draws/${drawId}/dates`, {
          headers: {
            // TODO 테스트 후 주석 제거
            // Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          const D_ERROR_CODES = ['D001', 'D002', 'D003'];
          setAvailableDates([]);
          setDatesErrorMessage(
            D_ERROR_CODES.includes(result.code)
              ? result.message
              : '예약 가능 날짜를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
          );
          return;
        }

        setDatesErrorMessage(null);
        setAvailableDates(
          result.data?.map((date: { entryDate: string }) => date.entryDate) ??
            []
        );
      } catch (error) {
        console.error('[draw/fetchDates]', error);
        setDatesErrorMessage('날짜 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsDatesLoading(false);
      }
    };
    fetchDates();
  }, [drawId, accessToken]);

  // ====================== 날짜 선택 시 해당 날짜의 회차 목록 조회
  useEffect(() => {
    // TODO 테스트 후 주석 제거
    // if (!accessToken || !selectedDate) return;
    if (!selectedDate) return;

    const fetchDatesOptions = async () => {
      setSlots([]);
      setSlotsErrorMessage(null);
      try {
        const response = await fetch(
          `/api/draws/${drawId}/dates/${selectedDate}/options`
          // TODO 테스트 후 주석 제거
          // { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const result = await response.json();

        if (!response.ok) {
          const D_ERROR_CODES = ['D001', 'D002', 'D003'];
          if (D_ERROR_CODES.includes(result.code)) {
            setSlotsErrorMessage(result.message);
          }
          return;
        }

        setSlotsErrorMessage(null);
        setSlots(result.data ?? []);
      } catch (error) {
        console.error('[draw/fetchDatesOptions]', error);
        setSlotsErrorMessage('회차 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchDatesOptions();
  }, [drawId, selectedDate, accessToken]);

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
                  <DrawTimeSlotSection
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

        {/* 우측 신청 요약 패널 */}
        <aside className="flex flex-col gap-s">
          <Box radius="ML" border="#0A0A0A14" padding="MS" className="min-w-0">
            <DrawApplySection
              drawId={drawId}
              selectedOptionId={selectedOptionId}
            />
          </Box>
          <SaleNoticeCard items={DrawInfoContent} />
        </aside>
      </div>
    </section>
  );
}

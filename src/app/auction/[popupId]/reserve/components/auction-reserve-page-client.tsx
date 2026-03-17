// 예약 페이지의 메인 조립 컴포넌트.
// 좌측 캘린더/회차 선택 상태를 들고 있고, 우측은 추후 결제 요약 컴포넌트가 들어올 자리다.

'use client';

import { useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { ReserveCalendarSection } from './reserve-calendar-section';
import {
  ReserveTimeSlotSection,
  type ReserveSchedule,
} from './reserve-time-slot-section';
import { Box } from '@/components/ui/box';
import SaleNoticeCard from '@/components/sale-detail/info/sale-notice-card';
import { AuctionInfoContent } from '@/constants/sale-detail';
import SaleInfoPrice from '@/components/sale-detail/info/sale-info-price';
import ReservePaymentSection from './reserve-payment-section';

interface AuctionReservePageClientProps {
  title: string;
  description: string;
  schedules: ReserveSchedule[];
}

export function AuctionReservePageClient({
  title,
  description,
  schedules,
}: AuctionReservePageClientProps) {
  // 첫 진입 시에는 아무 날짜도 선택하지 않은 상태로 시작
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // 현재 선택된 날짜에 해당하는 회차 목록만 아래 섹션에 넘김
  const selectedSchedule =
    schedules.find((schedule) => schedule.date === selectedDate) ?? null;

  return (
    <section className="flex flex-col gap-8">
      {/* 페이지 제목/설명 */}
      <div className="flex flex-col gap-xs">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)]"
        >
          {title}
        </Typography>
        <Typography
          variant="body-1"
          className="text-[var(--content-extra-low)]"
        >
          {description}
        </Typography>
      </div>

      <div className="grid gap-[54px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 좌측 메인 패널: 날짜 선택 + 회차 선택 */}
        <Box radius="ML" border="#0A0A0A14" padding="M" className="min-w-0">
          <ReserveCalendarSection
            schedules={schedules}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              // 날짜가 바뀌면 이전 회차 선택은 무효가 되므로 같이 초기화
              setSelectedDate(date);
              setSelectedSlotId(null);
            }}
          />

          {/* 선택된 날짜 기준 회차 카드 목록 */}
          <div className="mt-14">
            <ReserveTimeSlotSection
              selectedDate={selectedDate}
              selectedSlotId={selectedSlotId}
              schedule={selectedSchedule}
              onSelectSlot={setSelectedSlotId}
            />
          </div>
        </Box>

        {/* 우측 결제 요약 패널 */}
        <aside className="flex flex-col gap-s">
          <Box radius="ML" border="#0A0A0A14" padding="MS" className="min-w-0">
            <SaleInfoPrice
              startPrice={1000}
              phaseStatus={'OPEN'}
            ></SaleInfoPrice>
            <ReservePaymentSection
              phaseType={'OPEN'}
              phaseStatus={'AUCTION'}
            ></ReservePaymentSection>
          </Box>
          <SaleNoticeCard items={AuctionInfoContent} />
        </aside>
      </div>
    </section>
  );
}

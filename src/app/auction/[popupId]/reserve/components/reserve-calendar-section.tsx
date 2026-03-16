'use client';

import { useMemo, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { ReserveCalendar } from './reserve-calendar';
import type { ReserveSchedule } from './reserve-time-slot-section';

interface ReserveCalendarSectionProps {
  schedules: ReserveSchedule[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

// API/목업에서 받은 yyyy-mm-dd 문자열을 Date 객체로 바꾼다.
const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function ReserveCalendarSection({
  schedules,
  selectedDate,
  onSelectDate,
}: ReserveCalendarSectionProps) {
  // 선택된 날짜가 없을 때도 첫 데이터가 속한 월을 기본 표시 월로 사용한다.
  const fallbackDate = schedules[0]?.date ?? '2026-03-01';
  const initialMonth = selectedDate
    ? parseDate(selectedDate)
    : parseDate(fallbackDate);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  // 날짜별로 "선택 가능한 회차가 1개라도 있는지"만 뽑아서 달력 활성화에 사용한다.
  const availableDateMap = useMemo(() => {
    return new Map(
      schedules.map((schedule) => [
        schedule.date,
        schedule.slots.some((slot) => slot.remaining > 0),
      ])
    );
  }, [schedules]);

  return (
    <section>
      {/* 달력 섹션 제목 */}
      <Typography
        variant="heading-2"
        weight="bold"
        className="text-[var(--content-high)] mb-6"
      >
        일정을 선택해주세요
      </Typography>

      {/* 실제 달력 그리드 렌더링 */}
      <ReserveCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        availableDateMap={availableDateMap}
        onChangeMonth={setCurrentMonth}
        onSelectDate={onSelectDate}
      />
    </section>
  );
}

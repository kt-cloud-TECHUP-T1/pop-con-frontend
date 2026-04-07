'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ReserveCalendarSectionProps {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  errorMessage?: string | null;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// yyyy-mm-dd 문자열을 Date 객체로 바꿈
const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Date 객체를 yyyy-mm-dd 문자열로 바꿈
const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 현재 달 기준 5주치 날짜 셀을 만듦
// 전달/다음 달 날짜까지 포함해서 캘린더 모양을 유지
const createCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1); // 해당 월 1일
  const lastDay = new Date(year, month + 1, 0); // 이번 달 마지막 날

  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // 마지막 주 토요일

  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days; // 35개 or 42개
};

export function ReserveCalendarSection({
  availableDates,
  selectedDate,
  onSelectDate,
  errorMessage,
}: ReserveCalendarSectionProps) {
  // 유저가 명시적으로 이동한 달. null이면 availableDates[0] 기준으로 파생
  const [currentMonthOverride, setCurrentMonthOverride] = useState<Date | null>(
    null
  );

  // API 응답 전에는 오늘 달, 응답 후에는 첫 번째 선택 가능 날짜의 달로 자동 이동
  // 유저가 직접 달을 이동하면 그 달을 우선
  const currentMonth = useMemo(() => {
    if (currentMonthOverride !== null) return currentMonthOverride;
    if (availableDates.length > 0) {
      const date = parseDate(availableDates[0]);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [currentMonthOverride, availableDates]);

  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);
  const calendarDays = useMemo(
    () => createCalendarDays(currentMonth),
    [currentMonth]
  );

  return (
    <section>
      <Typography
        variant="heading-2"
        weight="bold"
        className="text-[var(--content-high)] mb-6"
      >
        일정을 선택해주세요
      </Typography>

      {errorMessage && (
        <div className="min-h-[500px] flex items-center justify-center">
          <Typography
            variant="label-2"
            className="text-[var(--content-extra-low)] text-center py-10"
          >
            {errorMessage}
          </Typography>
        </div>
      )}

      {!errorMessage && (
        <div>
          {/* 월 이동 헤더 */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center transition-colors text-[var(--neutral-60)] cursor-pointer"
              onClick={() =>
                setCurrentMonthOverride(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                )
              }
              aria-label="이전 달"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>

            <Typography variant="title-1" weight="bold" className="text-center">
              {currentMonth.getFullYear()}.
              {`${currentMonth.getMonth() + 1}`.padStart(2, '0')}
            </Typography>

            <button
              type="button"
              className="inline-flex items-center justify-center transition-colors text-[var(--neutral-60)] cursor-pointer"
              onClick={() =>
                setCurrentMonthOverride(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
              aria-label="다음 달"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </div>

          {/* 요일 헤더 + 날짜 버튼 */}
          <div className="mt-l grid grid-cols-7 gap-y-s text-center">
            {DAY_LABELS.map((label) => (
              <Typography
                key={label}
                variant="label-1"
                className="pb-xs text-[var(--content-extra-low)]"
              >
                {label}
              </Typography>
            ))}

            {calendarDays.map((date) => {
              const dateKey = toDateKey(date);
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth();
              const isAvailable = availableSet.has(dateKey);
              const isSelected = selectedDate === dateKey;

              return (
                <div
                  key={dateKey}
                  className="flex min-h-[88px] items-center justify-center"
                >
                  <Box
                    as="button"
                    type="button"
                    radius="ML"
                    disabled={!isAvailable}
                    onClick={() => onSelectDate(dateKey)}
                    className={cn(
                      'flex w-full max-w-[72px] h-full max-h-[72px] items-center justify-center transition-all',
                      isSelected && 'bg-[var(--orange-50)] text-white',
                      !isSelected &&
                        isCurrentMonth &&
                        isAvailable &&
                        'text-[var(--content-high)] hover:bg-[var(--orange-99)]',
                      !isSelected &&
                        isCurrentMonth &&
                        !isAvailable &&
                        'text-[var(--content-disabled)]',
                      !isCurrentMonth && 'text-[var(--content-disabled)]'
                    )}
                    aria-pressed={isSelected}
                  >
                    <Typography variant="label-1" weight="medium">
                      {date.getDate()}
                    </Typography>
                  </Box>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

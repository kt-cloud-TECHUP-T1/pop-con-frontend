// 일정 선택용 달력 그리드.
// 월 이동, 날짜 선택, 비활성 날짜 처리만 담당한다.

'use client';

import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface ReserveCalendarProps {
  currentMonth: Date;
  selectedDate: string | null;
  availableDateMap: Map<string, boolean>;
  onChangeMonth: (date: Date) => void;
  onSelectDate: (date: string) => void;
  className?: string;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// Date 객체를 schedule 데이터와 비교하기 쉬운 yyyy-mm-dd 문자열로 만든다.
const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 현재 달 기준 5주치 날짜 셀을 만든다.
// 전달/다음 달 날짜까지 포함해서 캘린더 모양을 유지한다.
const createCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export function ReserveCalendar({
  currentMonth,
  selectedDate,
  availableDateMap,
  onChangeMonth,
  onSelectDate,
  className,
}: ReserveCalendarProps) {
  const calendarDays = createCalendarDays(currentMonth);

  return (
    <div className={cn(className)}>
      {/* 월 이동 헤더 */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="inline-flex items-center justify-center transition-colors text-[var(--neutral-60)] cursor-pointer"
          onClick={() =>
            onChangeMonth(
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
            onChangeMonth(
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
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isAvailable = availableDateMap.has(dateKey);
          const hasSelectableSlot = availableDateMap.get(dateKey) ?? false;
          const isSelected = selectedDate === dateKey;

          return (
            <div
              key={dateKey}
              className="flex min-h-[88px] items-center justify-center"
            >
              {/* 회차가 없는 날짜는 disabled 처리해서 선택되지 않게 한다. */}
              <Box
                as="button"
                type="button"
                radius="ML"
                disabled={!isAvailable || !hasSelectableSlot}
                onClick={() => onSelectDate(dateKey)}
                className={cn(
                  'flex w-full max-w-[72px] h-full max-h-[72px] items-center justify-center transition-all',
                  isSelected && 'bg-[var(--orange-50)] text-white',
                  !isSelected &&
                    isCurrentMonth &&
                    isAvailable &&
                    hasSelectableSlot &&
                    'text-[var(--content-high)] hover:bg-[var(--orange-99)]',
                  !isSelected &&
                    isCurrentMonth &&
                    (!isAvailable || !hasSelectableSlot) &&
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
  );
}

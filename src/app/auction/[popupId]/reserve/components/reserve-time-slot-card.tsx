// 개별 회차 카드.
// 시간 표시 형식, 매진/선택 상태 스타일, 클릭 동작을 여기서 처리한다.

'use client';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ReserveSlot } from './reserve-time-slot-section';
import { Box } from '@/components/ui/box';

interface ReserveTimeSlotCardProps {
  slot: ReserveSlot;
  isSelected: boolean;
  onSelect: (slotId: string) => void;
}

// 시안에서는 회차명이 아니라 시작 시간만 크게 보여주기 때문에
// '11:00 - 11:30' 값을 '오전 11:00' 형식으로 변환한다.
const formatSlotTime = (time: string) => {
  const startTime = time.split(' - ')[0] ?? time;
  const [hourText, minuteText] = startTime.split(':');
  const hour = Number(hourText);
  const minute = minuteText ?? '00';
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

export function ReserveTimeSlotCard({
  slot,
  isSelected,
  onSelect,
}: ReserveTimeSlotCardProps) {
  // 잔여 좌석이 0이면 선택 불가 상태로 처리한다.
  const isSoldOut = slot.remaining <= 0;

  return (
    <Box
      as="button"
      type="button"
      border="#0A0A0A14"
      radius="ML"
      padding="S"
      disabled={isSoldOut}
      onClick={() => onSelect(slot.id)}
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all',
        // 현재 선택된 회차
        isSelected && 'border-[var(--orange-50)] bg-[var(--orange-50)]',
        // 매진 회차
        isSoldOut && 'border-[var(--neutral-90)] bg-[var(--neutral-99)]'
      )}
    >
      <Typography
        variant="label-1"
        weight="medium"
        className={cn(
          isSelected
            ? 'text-white'
            : isSoldOut
              ? 'text-[var(--content-placeholder)]'
              : 'text-[var(--content-high)]'
        )}
      >
        {formatSlotTime(slot.time)}
      </Typography>
      <Typography
        variant="caption-1"
        className={cn(
          isSelected
            ? 'text-white'
            : isSoldOut
              ? 'text-[var(--content-disabled)]'
              : 'text-[var(--content-extra-low)]'
        )}
      >
        {isSoldOut ? '매진' : `잔여 ${slot.remaining}`}
      </Typography>
    </Box>
  );
}

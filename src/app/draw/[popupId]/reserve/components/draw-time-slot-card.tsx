'use client';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import type { DrawSlot } from './draw-reserve-page-client';

interface DrawTimeSlotCardProps {
  slot: DrawSlot;
  isSelected: boolean;
  onSelect: (optionId: number) => void;
}

// options API는 '13:30:00' 형식으로 entryTime을 반환하므로
// '오전 01:30' 형식으로 변환한다.
const formatSlotTime = (time: string) => {
  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = minuteText ?? '00';
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour.toString().padStart(2, '0')}:${minute}`;
};

export function DrawTimeSlotCard({
  slot,
  isSelected,
  onSelect,
}: DrawTimeSlotCardProps) {
  return (
    <Box
      as="button"
      type="button"
      border="#0A0A0A14"
      radius="ML"
      padding="S"
      onClick={() => onSelect(slot.optionId)}
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all',
        isSelected && 'border-[var(--orange-50)] bg-[var(--orange-50)]'
      )}
    >
      <Typography
        variant="label-1"
        weight="medium"
        className={isSelected ? 'text-white' : 'text-[var(--content-high)]'}
      >
        {formatSlotTime(slot.entryTime)}
      </Typography>
    </Box>
  );
}
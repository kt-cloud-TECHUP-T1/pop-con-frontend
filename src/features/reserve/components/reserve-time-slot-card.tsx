'use client';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Box } from '@/components/ui/box';
import type { AuctionSlot, DrawSlot } from '@/features/reserve/types/reserve';

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

type ReserveTimeSlotCardProps =
  | {
      variant: 'auction';
      slot: AuctionSlot;
      isSelected: boolean;
      onSelect: (optionId: number) => void;
    }
  | {
      variant: 'draw';
      slot: DrawSlot;
      isSelected: boolean;
      onSelect: (optionId: number) => void;
    };

export function ReserveTimeSlotCard(props: ReserveTimeSlotCardProps) {
  const { variant, slot, isSelected, onSelect } = props;

  if (variant === 'auction') {
    const isSoldOut = slot.remainingStock <= 0 || !slot.selectable;

    return (
      <Box
        as="button"
        type="button"
        border="#0A0A0A14"
        radius="ML"
        padding="S"
        disabled={isSoldOut}
        onClick={() => onSelect(slot.optionId)}
        className={cn(
          'flex flex-col items-center justify-center text-center transition-all',
          !isSelected &&
            !isSoldOut &&
            'hover:bg-[var(--orange-95)] active:bg-[var(--orange-90)]',
          isSelected && 'border-[var(--orange-50)] bg-[var(--orange-50)]',
          isSoldOut &&
            'border-[var(--neutral-90)] bg-[var(--neutral-99)] cursor-not-allowed'
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
          {formatSlotTime(slot.entryTime)}
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
          {isSoldOut ? '매진' : `잔여 ${slot.remainingStock}`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      as="button"
      type="button"
      border="#0A0A0A14"
      radius="ML"
      padding="MS"
      onClick={() => onSelect(slot.optionId)}
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all',
        !isSelected &&
          'hover:bg-[var(--orange-95)] hover:border-[var(--orange-45)] active:bg-[var(--orange-90)]',
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

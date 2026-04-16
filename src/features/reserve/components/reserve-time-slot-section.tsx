'use client';

import { Fragment } from 'react';
import { Typography } from '@/components/ui/typography';
import { SlotSkeleton } from './reserve-panel-skeleton';
import { formatDateKorean } from '@/lib/utils';

interface ReserveTimeSlotSectionProps<TSlot extends { optionId: number }> {
  selectedDate: string | null;
  selectedOptionId: number | null;
  slots: TSlot[];
  onSelectSlot: (optionId: number) => void;
  errorMessage?: string | null;
  isLoading?: boolean;
  renderSlot: (slot: TSlot, isSelected: boolean) => React.ReactNode;
  slotLabel?: string;
}

export function ReserveTimeSlotSection<TSlot extends { optionId: number }>({
  selectedDate,
  selectedOptionId,
  slots,
  onSelectSlot,
  errorMessage,
  isLoading,
  renderSlot,
  slotLabel = '회차를 선택해주세요',
}: ReserveTimeSlotSectionProps<TSlot>) {
  return (
    <section>
      <div className="flex flex-col gap-xs">
        <Typography variant="heading-2" weight="bold">
          <span className="text-[var(--orange-50)]">
            {formatDateKorean(selectedDate)}
          </span>{' '}
          {slotLabel}
        </Typography>
      </div>

      {!selectedDate ? (
        // 날짜 선택 전 안내
        <div className="flex min-h-[250px] items-center justify-center mt-6">
          <Typography
            variant="label-2"
            className="text-center whitespace-pre-line text-[var(--content-extra-low)]"
          >
            원하는 날짜를 선택하면{'\n'}이용 가능한 회차 정보를 확인할 수
            있습니다.
          </Typography>
        </div>
      ) : errorMessage ? (
        <div className="flex min-h-[250px] items-center justify-center mt-6">
          <Typography
            variant="label-2"
            className="text-center text-[var(--content-extra-low)]"
          >
            {errorMessage}
          </Typography>
        </div>
      ) : isLoading ? (
        <div className="mt-6 animate-pulse">
          <SlotSkeleton />
        </div>
      ) : slots.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center mt-6">
          <Typography
            variant="label-2"
            className="text-center text-[var(--content-extra-low)]"
          >
            해당 날짜에 이용 가능한 회차가 없습니다.
          </Typography>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-s md:grid-cols-3">
          {slots.map((slot) => (
            <Fragment key={slot.optionId}>
              {renderSlot(slot, selectedOptionId === slot.optionId)}
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}

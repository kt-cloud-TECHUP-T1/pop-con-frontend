'use client';

import { Typography } from '@/components/ui/typography';
import { DrawTimeSlotCard } from './draw-time-slot-card';
import type { DrawSlot } from './draw-reserve-page-client';

interface DrawTimeSlotSectionProps {
  selectedDate: string | null;
  selectedOptionId: number | null;
  slots: DrawSlot[];
  onSelectSlot: (optionId: number) => void;
  errorMessage?: string | null;
}

export function DrawTimeSlotSection({
  selectedDate,
  selectedOptionId,
  slots,
  onSelectSlot,
  errorMessage,
}: DrawTimeSlotSectionProps) {
  return (
    <section>
      <div className="flex flex-col gap-xs">
        <Typography variant="heading-2" weight="bold">
          회차를 선택해주세요
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
        // D001 / D002 / D003 에러
        <div className="flex min-h-[250px] items-center justify-center mt-6">
          <Typography
            variant="label-2"
            className="text-center text-[var(--content-extra-low)]"
          >
            {errorMessage}
          </Typography>
        </div>
      ) : slots.length === 0 ? (
        // 날짜 선택 후 조회 가능한 회차 없음
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
            <DrawTimeSlotCard
              key={slot.optionId}
              slot={slot}
              isSelected={selectedOptionId === slot.optionId}
              onSelect={onSelectSlot}
            />
          ))}
        </div>
      )}
    </section>
  );
}
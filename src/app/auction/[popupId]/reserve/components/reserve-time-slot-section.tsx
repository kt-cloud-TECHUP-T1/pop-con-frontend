'use client';

import { Typography } from '@/components/ui/typography';
import { ReserveTimeSlotCard } from './reserve-time-slot-card';

export interface ReserveSlot {
  id: string;
  label: string;
  time: string;
  remaining: number;
}

export interface ReserveSchedule {
  date: string;
  slots: ReserveSlot[];
}

interface ReserveTimeSlotSectionProps {
  selectedDate: string | null;
  selectedSlotId: string | null;
  schedule: ReserveSchedule | null;
  onSelectSlot: (slotId: string) => void;
}

export function ReserveTimeSlotSection({
  selectedDate,
  selectedSlotId,
  schedule,
  onSelectSlot,
}: ReserveTimeSlotSectionProps) {
  return (
    <section>
      {/* 회차 섹션 제목 */}
      <div className="flex flex-col gap-xs">
        <Typography variant="heading-2" weight="bold">
          회차를 선택해주세요
        </Typography>
      </div>

      {!selectedDate || !schedule ? (
        // 날짜 선택 전에는 회차 대신 안내 문구만 보여준다.
        <div className="flex min-h-[250px] items-center justify-center mt-6">
          <Typography
            variant="body-1"
            className="text-center whitespace-pre-line text-[var(--content-placeholder)]"
          >
            원하는 날짜를 선택하면{'\n'}이용 가능한 회차 정보를 확인할 수
            있습니다.
          </Typography>
        </div>
      ) : (
        // 날짜 선택 후에는 해당 날짜의 회차 카드 목록을 grid로 렌더링한다.
        <div className="mt-6 grid grid-cols-2 gap-s md:grid-cols-3">
          {schedule.slots.map((slot) => (
            <ReserveTimeSlotCard
              key={slot.id}
              slot={slot}
              isSelected={selectedSlotId === slot.id}
              onSelect={onSelectSlot}
            />
          ))}
        </div>
      )}
    </section>
  );
}

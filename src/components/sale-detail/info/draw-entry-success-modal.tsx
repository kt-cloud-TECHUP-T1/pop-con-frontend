'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { DrawEntrySuccessData } from '@/types/applay/draw-apply';

interface DrawEntrySuccessModalProps {
  open: boolean;
  data: DrawEntrySuccessData | null;
  onClose: () => void;
}

export default function DrawEntrySuccessModal({
  open,
  data,
  onClose,
}: DrawEntrySuccessModalProps) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-[480px] rounded-ml bg-white px-5 py-s">
        <div className="mb-4 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6A00]">
            <span className="text-2xl font-bold text-white">✓</span>
          </div>

          <Typography variant="heading-2" weight="bold" className="text-center">
            응모가 완료되었어요!
          </Typography>
        </div>

        <div className="mb-4 flex gap-3 rounded-[12px] bg-[#F7F7F8] p-3">
          <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[#EAEAEA]"></div>

          <div className="min-w-0 flex-1">
            <Typography variant="body-1" weight="bold" className="truncate">
              {data.popupTitle}
            </Typography>
            <Typography
              variant="caption-1"
              weight="regular"
              className="mt-1 text-[var(--text-subtle)]"
            >
              {data.popupAddress}
            </Typography>
          </div>
        </div>

        <div className="mb-5 border-t border-[var(--border-subtle)] pt-4">
          <div className="mb-2 flex">
            <Typography
              variant="body-2"
              weight="regular"
              className="w-[56px] text-[var(--text-subtle)]"
            >
              일정
            </Typography>
            <Typography variant="body-2" weight="bold">
              {data.entryDate} {data.entryTime}
            </Typography>
          </div>

          <div className="mb-2 flex">
            <Typography
              variant="body-2"
              weight="regular"
              className="w-[56px] text-[var(--text-subtle)]"
            >
              이름
            </Typography>
            <Typography variant="body-2" weight="bold">
              {data.userName}
            </Typography>
          </div>

          <div className="flex">
            <Typography
              variant="body-2"
              weight="regular"
              className="w-[56px] text-[var(--text-subtle)]"
            >
              연락처
            </Typography>
            <Typography variant="body-2" weight="bold">
              {data.userPhoneNumber}
            </Typography>
          </div>
        </div>

        <Button className="w-full" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  );
}

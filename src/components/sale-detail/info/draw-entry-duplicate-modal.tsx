'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

interface DrawEntryDuplicateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DrawEntryDuplicateModal({
  open,
  onClose,
}: DrawEntryDuplicateModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-[356px] rounded-[20px] bg-white px-5 pb-5 pt-8">
        <div className="mb-6 text-center">
          <Typography
            variant="heading-2"
            weight="bold"
            className="mb-2 text-center"
          >
            이미 이 드로우에 응모했어요
          </Typography>

          <Typography
            variant="body-2"
            weight="regular"
            className="text-[var(--text-subtle)]"
          >
            응모 내역은 마이페이지에서 확인할 수 있어요
          </Typography>
        </div>

        <Button className="w-full" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { PROFILE_MESSAGES } from '@/features/user/constants/profile';

interface NicknameDuplicateModalProps {
  open: boolean;
  onClose: () => void;
}

export function NicknameDuplicateModal({
  open,
  onClose,
}: NicknameDuplicateModalProps) {
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
            {PROFILE_MESSAGES.MODAL.DUPLICATE_NICKNAME_TITLE}
          </Typography>

          <Typography
            variant="body-2"
            weight="regular"
            className="text-[var(--text-subtle)]"
          >
            {PROFILE_MESSAGES.MODAL.DUPLICATE_NICKNAME_DESCRIPTION}
          </Typography>
        </div>

        <Button className="w-full" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
}

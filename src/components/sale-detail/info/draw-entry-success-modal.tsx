'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { DrawEntrySuccessData } from '@/types/draw/draw-apply';
import { Icon } from '@/components/Icon/Icon';
import { formatEntryDate, formatEntryTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Box } from '@/components/ui/box';

interface DrawEntrySuccessModalProps {
  open: boolean;
  data: DrawEntrySuccessData | null;
  onClose?: () => void;
}

export default function DrawEntrySuccessModal({
  open,
  data,
  onClose,
}: DrawEntrySuccessModalProps) {
  const router = useRouter();

  if (!open || !data) return null;

  const entrySchedule = `${formatEntryDate(data.entryDate)} ${formatEntryTime(
    data.entryTime
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <Box radius="ML" paddingY="S" className="w-full max-w-[480px] bg-white">
        <div className=" flex flex-col items-center gap-xs py-s">
          <Icon
            name="CircleCheckFill"
            size={64}
            className="text-[var(--btn-primary-default)]"
          />

          <Typography variant="title-1" weight="bold" className="text-center">
            응모가 완료되었어요!
          </Typography>
        </div>

        <div className="info-container py-s px-m">
          <div className="flex gap-[16px] border-b border-[var(--line-3)] pb-ms">
            <div className="relative w-[62px] aspect-[3/4] rounded-s border overflow-hidden">
              <Image
                src={data.thumbnailUrl}
                alt={data.popupTitle}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-xs justify-center">
              <Typography variant="body-1" weight="bold">
                {data.popupTitle}
              </Typography>
              <Typography
                variant="caption-1"
                weight="regular"
                className="text-[var(--content-extra-low)]"
              >
                {data.popupAddress}
              </Typography>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[50px_1fr] pt-ms gap-xs">
              <Typography
                variant="body-1"
                weight="regular"
                className="text-[var(--content-extra-low)]"
              >
                일정
              </Typography>
              <Typography variant="body-1" weight="medium">
                {entrySchedule}
              </Typography>

              <Typography
                variant="body-1"
                weight="regular"
                className="text-[var(--content-extra-low)]"
              >
                이름
              </Typography>
              <Typography variant="body-1" weight="medium">
                {data.userName}
              </Typography>

              <Typography
                variant="body-1"
                weight="regular"
                className="text-[var(--content-extra-low)]"
              >
                연락처
              </Typography>
              <Typography variant="body-1" weight="medium">
                {data.userPhoneNumber}
              </Typography>
            </div>
          </div>
        </div>

        <div className="py-s px-ms">
          <Button
            className="w-full"
            onClick={() => {
              onClose?.();
              router.push('/');
            }}
          >
            확인
          </Button>
        </div>
      </Box>
    </div>
  );
}

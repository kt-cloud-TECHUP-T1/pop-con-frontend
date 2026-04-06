import { Icon } from '@/components/Icon/Icon';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type SoldOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SoldOutModal({ isOpen, onClose }: SoldOutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[480px] rounded-ml bg-white px-6 py-8">
        <div className="flex flex-col items-center">
          <Icon
            size={56}
            name="ExclamationFill"
            className="text-[var(--status-warning)]"
          ></Icon>

          <Typography variant="title-1" weight="bold" className="mb-2">
            티켓이 매진 되었습니다.
          </Typography>

          <Typography
            variant="body-2"
            weight="regular"
            className="mb-8 text-center text-[var(--content-low)]"
          >
            아쉽게도 모든 티켓이 매진되었습니다.
          </Typography>

          <Button className="w-full" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}

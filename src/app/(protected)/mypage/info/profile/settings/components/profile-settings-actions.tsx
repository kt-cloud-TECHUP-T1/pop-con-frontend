import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

interface ProfileSettingsActionsProps {
  cancelHref: string;
  onSave: () => void;
  isSaving?: boolean;
}

export function ProfileSettingsActions({
  cancelHref,
  onSave,
  isSaving = false,
}: ProfileSettingsActionsProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <Link
        href={cancelHref}
        className={buttonVariants({
          variant: 'secondary',
          size: 'large',
          className: 'min-w-[200px]',
        })}
      >
        취소
      </Link>
      <Button
        type="button"
        size="large"
        className="min-w-[200px]"
        onClick={onSave}
        disabled={isSaving}
      >
        저장
      </Button>
    </div>
  );
}

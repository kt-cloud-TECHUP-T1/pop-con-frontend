import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

type ProfileActionButtonsProps = {
  settingsHref: string;
  personalInfoHref: string;
};

export function ProfileActionButtons({
  settingsHref,
  personalInfoHref,
}: ProfileActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={settingsHref}
        className={buttonVariants({ variant: 'tertiary', size: 'small' })}
      >
        프로필 설정
      </Link>
      <Link
        href={personalInfoHref}
        className={buttonVariants({ variant: 'tertiary', size: 'small' })}
      >
        개인정보 수정
      </Link>
    </div>
  );
}

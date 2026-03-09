import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

type ProfileActionButtonsProps = {
  settingsHref: string;
};

export function ProfileActionButtons({ settingsHref }: ProfileActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={settingsHref}
        className={buttonVariants({ variant: 'tertiary', size: 'small' })}
      >
        프로필 설정
      </Link>
      {/* TODO: 개인정보 수정 페이지/액션 구현 후 onClick 또는 Link로 연결한다. */}
      <Button variant="tertiary" size="small" disabled>
        개인정보 수정
      </Button>
    </div>
  );
}

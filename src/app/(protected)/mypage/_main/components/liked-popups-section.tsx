import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { likedPopups } from '@/app/(protected)/mypage/_main/data/mock-data';

export function LikedPopupsSection() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Typography variant="heading-1" weight="bold">
          찜한 팝업스토어
        </Typography>
        <Link
          href="/mypage/activity/liked-popups"
          className="inline-flex items-center gap-1 text-sm text-[var(--neutral-60)] transition-colors hover:text-[var(--neutral-10)]"
        >
          더보기
          <Icon name="ChevronRightSmall" size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
        {likedPopups.map((popup) => (
          <LikedPopupCard
            key={popup.id}
            title={popup.title}
            description={popup.description}
            caption={popup.caption}
            thumbnailUrl={popup.thumbnailUrl}
          />
        ))}
      </div>
    </section>
  );
}

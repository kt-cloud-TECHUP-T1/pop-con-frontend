import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { PageHeader } from '@/components/shared/page-header';

const likedPopups = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `POP-CON STORE ${index + 1}`,
  description: '지금 가장 인기 있는 팝업',
  caption: '서울 성동구 성수동',
  thumbnailUrl: '/images/temp/no-image.png',
}));

export function LikedPopupsSection() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <PageHeader
          title="찜한 팝업스토어"
          titleVariant="heading-1"
          titleWeight="bold"
        />
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

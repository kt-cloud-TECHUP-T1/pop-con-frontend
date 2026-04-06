import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { PageHeader } from '@/components/shared/page-header';

const likedPopups = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: `Title ${index + 1}`,
  description: `Sub Text ${index + 1}`,
  caption: `Caption ${index + 1}`,
  thumbnailUrl: '/images/temp/no-image.png',
}));

export default function MyPageActivityLikedPopupsPage() {
  return (
    <section>
      <PageHeader
        title="찜한 팝업스토어"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

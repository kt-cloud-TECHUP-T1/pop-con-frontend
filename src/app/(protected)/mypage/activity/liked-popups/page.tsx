import { LikedPopupCard } from '@/components/mypage/liked-popup-card';
import { MyPagePageHeader } from '@/components/mypage/page-header';

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
      <MyPagePageHeader title="찜한 팝업스토어" titleVariant="title-2" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

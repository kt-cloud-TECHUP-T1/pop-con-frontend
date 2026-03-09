import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import { SaleDetailSidebar } from '@/components/sale-detail/summary/sale-detail-sidebar';

const mockData = {
  phaseType: 'AUCTION',
  phaseStatus: 'UPCOMING',
  popupId: 1,
  liked: true,
  thumbnailUrl: 'https://imagelink.com/thumbnail.jpg',
  images: [
    'https://imagelink.com/image1.jpg',
    'https://imagelink.com/image2.jpg',
    'https://imagelink.com/image3.jpg',
  ],
  subtitle: 'Oneira X POPUP SEOUL',
  title: '오네이라 팝업 스토어',
  viewCount: 200,
  likeCount: 200,
  description: '...',
  location: '서울 영등포구 여의대로 108, 더현대 서울',
  reviewCount: 0,
  openAt: '2026-02-15',
  closeAt: '2026-03-15',
  weekdayOpen: '11:00',
  weekdayClose: '21:00',
  weekendOpen: '10:00',
  weekendClose: '22:00',
  auctionOpenAt: '2026-02-09T10:00:00+09:00',
  auctionCloseAt: '2026-02-12T18:00:00+09:00',
  drawOpenAt: '2026-02-14T10:00:00+09:00',
  drawCloseAt: '2026-02-18T18:00:00+09:00',
  startPrice: 132000,
  currentPrice: 102000,
  extraTicket: 10,
};

export default function AuctionPage() {
  const data = mockData;
  return (
    <Wrapper className="py-[var(--spacing-l)]">
      <SaleDetailLayout
        left={
          <SaleDetailMain
            title={data.title}
            subtitle={data.subtitle}
            description={data.description}
            image={data.thumbnailUrl}
            location={data.location}
            reviewCount={data.reviewCount}
            viewCount={data.viewCount}
            likeCount={data.likeCount}
          ></SaleDetailMain>
        }
        right={
          <SaleDetailSidebar
            openAt={data.openAt}
            closeAt={data.closeAt}
            weekdayOpen={data.weekdayOpen}
            weekdayClose={data.weekdayClose}
            weekendOpen={data.weekendOpen}
            weekendClose={data.weekendClose}
            auctionOpenAt={data.auctionOpenAt}
            auctionCloseAt={data.auctionCloseAt}
            drawOpenAt={data.drawOpenAt}
            drawCloseAt={data.drawCloseAt}
            startPrice={data.startPrice}
            currentPrice={data.currentPrice}
            extraTicket={data.extraTicket}
            phaseType={data.phaseType}
            phaseStatus={data.phaseStatus}
          ></SaleDetailSidebar>
        }
      />
    </Wrapper>
  );
}

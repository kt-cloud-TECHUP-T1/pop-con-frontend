import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import { SaleDetailMain } from '@/components/sale-detail/contents/sale-detail-main';
import SaleTimeCountBar from '@/components/sale-detail/contents/sale-time-count-bar';
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
  description: `Lee가 101 라인 101주년을 기념해 더현대 서울에서 팝업을 진행합니다.👖
    오랜 시간 쌓아온 데님 헤리티지와 101 라인의 상징성을 공간 안에 풀어냈습니다.
    다양한 리워드와 팝업 기간동안의 특별한 혜택을 받아보세요!🩵

    [EVENT]
    ① 02.18 PM 1:01 선착순 이벤트
    팝업 스토어 촬영 후 인스타그램 스토리 업로드 시, 선착순 101명 볼캡 증정

    ② 구매 금액대별 혜택
    40만원 이상 → 반다나 반팔 티셔츠(20명)
    20만원 이상 → 빅 트위치 로고 투웨이 에코백(30명)
    10만원 이상 → 오버롤 미니 파우치(30명)
    제품 구매 고객 → 금속 뱃지 세트(200명) *ACC 제외

    ③ 럭키드로우 이벤트
    Lee 공식 인스타그램 팔로우하고 스토리 업로드 시 : 럭키드로우 참여 기회 제공
    1등 셀비지 셋업(3명)
    2등 Lee 빈티지 라벨 티셔츠(5명)
    3등 스몰 트위치 로고 데님 볼캡(10명)
    4등 오버롤 키링(20명)
    5등 101 원형 뱃지 *컬러 랜덤(1000명)

    [INFO]
    📍장소 : 서울 영등포구 여의대로 108, 더현대 서울
    📅일정 : 2/18(수) ~ 2/25(수)
    ⏰시간 : 월-목 10:30 ~ 20:00 / 금-일 10:30 ~ 20:30
    `,
  location: '서울 영등포구 여의대로 108, 더현대 서울',
  reviewCount: 0,
  openAt: '2026-02-15',
  closeAt: '2026-03-15',
  weekdayOpen: '11:00',
  weekdayClose: '21:00',
  weekendOpen: '10:00',
  weekendClose: '22:00',
  auctionOpenAt: '2026-02-09T10:00:00+09:00',
  auctionCloseAt: '2026-03-12T18:00:00+09:00',
  drawOpenAt: '2026-02-14T10:00:00+09:00',
  drawCloseAt: '2026-02-18T18:00:00+09:00',
  serverNow: '2026-03-11T18:09:00+09:00',
  startPrice: 132000,
  currentPrice: 102000,
  extraTicket: 10,
};

export default function AuctionPage() {
  const data = mockData;
  const hasStickyTopBar = data.phaseStatus !== 'UPCOMING';

  return (
    <div>
      <SaleTimeCountBar
        phaseStatus={data.phaseStatus} // 'UPCOMING' | 'OPEN' | 'CLOSED'
        auctionCloseAt={data.auctionCloseAt}
        serverNow={data.serverNow}
      />
      <Wrapper className="py-m">
        <SaleDetailLayout
          hasStickyTopBar={hasStickyTopBar}
          left={
            <SaleDetailMain
              description={data.description}
              image={data.thumbnailUrl}
              location={data.location}
              reviewCount={data.reviewCount}
              title={data.title}
              subtitle={data.subtitle}
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
              startPrice={data.startPrice}
              currentPrice={data.currentPrice}
              extraTicket={data.extraTicket}
              phaseType={data.phaseType}
              phaseStatus={data.phaseStatus}
            ></SaleDetailSidebar>
          }
        />
      </Wrapper>
    </div>
  );
}

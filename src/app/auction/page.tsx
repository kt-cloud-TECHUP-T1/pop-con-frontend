import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import SaleContent from '@/components/sale-detail/contents/sale-content';
import SaleHeader from '@/components/sale-detail/contents/sale-header';
import { SaleMap } from '@/components/sale-detail/contents/sale-map';
import SaleReview from '@/components/sale-detail/contents/sale-review';
import SaleTab from '@/components/sale-detail/contents/sale-tab';
import { SaleThumbnail } from '@/components/sale-detail/contents/sale-thumbnail';
import NoticeCard from '@/components/sale-detail/summary/notice-card';
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';

export default function AuctionPage() {
  return (
    <Wrapper className="py-[var(--spacing-l)]">
      <SaleDetailLayout
        left={
          <div className="flex flex-col gap-ms ">
            <SaleThumbnail size="lg" src="/images/temp/no-image.png" />
            <SaleHeader
              subTitle="T1 x subTitle"
              title="T1 팝업 Title"
            ></SaleHeader>
            <SaleTab viewCount={0}></SaleTab>
            <section id="content" className="scroll-mt-24">
              <SaleContent />
            </section>
            <section id="map" className="scroll-mt-24">
              <SaleMap></SaleMap>
            </section>

            <section id="review">
              <SaleReview></SaleReview>
            </section>
          </div>
        }
        right={
          <div>
            <div className="flex flex-col gap-xs">
              <NoticeCard
                items={[
                  '경매 및 드로우 신청은 1인 1회로 제한됩니다.',
                  '당첨자는 신청 마감 후 24시간 내 개별 연락드립니다.',
                  '2분마다 경매입니다. ',
                  '본인 확인을 위해 신분증을 지참해주세요.',
                ]}
              />
              <PaymentRegisterCard title="경매" />
            </div>
          </div>
        }
      />
      <div className="pt-[50px]">
        <SaleContent />
      </div>
    </Wrapper>
  );
}

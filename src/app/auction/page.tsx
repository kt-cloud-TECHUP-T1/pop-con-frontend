import { SaleDetailLayout } from '@/components/layout/sale-detail-layout';
import { Wrapper } from '@/components/layout/wrapper';
import NoticeCard from '@/components/sale-detail/summary/notice-card';
import PaymentRegisterCard from '@/components/sale-detail/summary/payment-register-card';

export default function AuctionPage() {
  return (
    <Wrapper className="py-[var(--spacing-l)]">
      <SaleDetailLayout
        left={<div className="h-[1600px] ">LEFT 영역</div>}
        right={
          <div className="h-[600px] ">
            RIGHT 영역
            <div>
              <NoticeCard
                items={[
                  '경매 및 드로우 신청은 1인 1회로 제한됩니다.',
                  '당첨자는 신청 마감 후 24시간 내 개별 연락드립니다.',
                  '2분마다 경매입니다. ',
                  '본인 확인을 위해 신분증을 지참해주세요.',
                ]}
              ></NoticeCard>
              <PaymentRegisterCard title="경매"></PaymentRegisterCard>
            </div>
          </div>
        }
      />
    </Wrapper>
  );
}

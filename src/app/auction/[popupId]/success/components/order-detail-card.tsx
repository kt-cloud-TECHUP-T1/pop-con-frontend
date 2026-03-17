// order-detail-card.tsx
import { formatWon } from '@/lib/utils';

interface OrderDetailCardProps {
  data: {
    reservationNumber: string;
    popup: {
      id: number;
      title: string;
      reservedAt: string;
      location: string;
      thumbnailUrl: string;
    };
    payment: {
      startPrice: number;
      discountAmount: number;
      finalBidPrice: number;
    };
  };
}

export default function OrderDetailCard({ data }: OrderDetailCardProps) {
  return (
    <section className="w-full rounded-[24px] border border-[var(--line-line-1,#E5E5E5)] bg-white p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-[36px] font-bold leading-[44px] text-black">
            주문내역
          </h2>

          <div className="border-b border-[var(--line-line-1,#E5E5E5)] pb-8 text-[18px] leading-[28px] text-[var(--contents-low,#8C8C8C)]">
            예약번호: {data.reservationNumber}
          </div>

          <div className="rounded-[24px] border border-[var(--line-line-1,#E5E5E5)] p-8">
            <div className="flex items-center gap-6">
              <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[16px] bg-[var(--background-base-2,#F3F3F3)]">
                {data.popup.thumbnailUrl ? (
                  <img
                    src={data.popup.thumbnailUrl}
                    alt={data.popup.title}
                    className="h-full w-full rounded-[16px] object-cover"
                  />
                ) : (
                  <div className="text-[14px] text-[var(--contents-extra-low,#B3B3B3)]">
                    이미지
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="text-[28px] font-bold leading-[36px] text-black">
                  {data.popup.title}
                </h3>
                <p className="text-[18px] leading-[28px] text-[var(--contents-low,#8C8C8C)]">
                  {data.popup.reservedAt}
                </p>
                <p className="text-[18px] leading-[28px] text-[var(--contents-low,#8C8C8C)]">
                  {data.popup.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--line-line-1,#E5E5E5)] p-8">
          <div className="flex flex-col gap-8">
            <h2 className="text-[36px] font-bold leading-[44px] text-black">
              결제 금액
            </h2>

            <div className="flex flex-col gap-4 text-[18px] leading-[28px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--contents-low,#8C8C8C)]">
                  시작가
                </span>
                <span className="text-[var(--contents-low,#8C8C8C)]">
                  {formatWon(data.payment.startPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--contents-low,#8C8C8C)]">
                  할인 금액
                </span>
                <span className="text-[var(--contents-low,#8C8C8C)]">
                  -{formatWon(data.payment.discountAmount)}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--line-line-1,#E5E5E5)] pt-8">
              <div className="flex items-center justify-between">
                <span className="text-[28px] font-bold leading-[36px] text-black">
                  최종 낙찰 금액
                </span>
                <span className="text-[40px] font-bold leading-[48px] text-[#FF5C00]">
                  {formatWon(data.payment.finalBidPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

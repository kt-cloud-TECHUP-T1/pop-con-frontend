import { Icon } from '@/components/Icon/Icon';
import { Wrapper } from '@/components/layout/wrapper';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { formatWon } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export interface OrderDetail {
  reservationNumber: string;

  popup: {
    id: number;
    title: string;
    date: string; // ISO 추천
    timeText: string; // "오후 1:30" 같은 포맷용
    location: string;
    thumbnailUrl: string;
  };

  payment: {
    originalPrice: number;
    discountPrice: number;
    finalPrice: number;
  };
}

export const mockOrderDetail: OrderDetail = {
  reservationNumber: 'TKT50434728',

  popup: {
    id: 1,
    title: 'T1 팝업 스토어',
    date: '2026-03-14T13:30:00',
    timeText: '2026.03.14(토) 오후 1:30',
    location: '서울 영등포구 여의대로 108, 더현대 서울',
    thumbnailUrl: '/images/temp/no-image.png',
  },

  payment: {
    originalPrice: 132000,
    discountPrice: -30000,
    finalPrice: 102000,
  },
};

export default async function Success({
  params,
}: {
  params: Promise<{ popupId: string }>;
}) {
  await params;

  return (
    <>
      <Wrapper className="py-3xl max-w-[762px] ">
        <div className="flex flex-col gap-m w-full">
          <div className="flex flex-col gap-xs items-center">
            <Icon
              name="CircleCheckFill"
              size={72}
              className="text-[var(--btn-primary-default)]"
            ></Icon>
            <Typography variant="heading-1" weight="bold">
              낙찰 완료
            </Typography>
            <Typography
              variant="body-1"
              weight="regular"
              className="text-[var(--content-extra-low)]"
            >
              티켓 구매가 성공적으로 완료되었습니다.
            </Typography>
          </div>
          <div className="flex flex-col gap-xs">
            <Box
              padding="MS"
              border="var(--line-3)"
              radius="MS"
              className="flex flex-col gap-ms"
            >
              <Typography variant="title-2" weight="bold">
                주문 내역
              </Typography>
              <div>
                <div className="  pb-s border-b border-[var(--line-3)]">
                  <Typography
                    variant="caption-1"
                    weight="regular"
                    className="text-[var(--content-extra-low)] "
                  >
                    예약번호 : {mockOrderDetail.reservationNumber}
                  </Typography>
                </div>
                <div className="pt-s flex gap-s">
                  <div className="relative w-[60px] aspect-[3/4] rounded-[8px] border overflow-hidden">
                    <Image
                      src="/images/temp/no-image.png"
                      alt="썸네일"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="body-1"
                      weight="bold"
                      className="pb-[8px]"
                    >
                      {mockOrderDetail.popup.title}
                    </Typography>
                    <Typography
                      variant="caption-1"
                      weight="regular"
                      className="text-[var(--content-extra-low)] "
                    >
                      {mockOrderDetail.popup.timeText}
                    </Typography>
                    <Typography
                      variant="caption-1"
                      weight="regular"
                      className="text-[var(--content-extra-low)] pt-[4px]"
                    >
                      {mockOrderDetail.popup.location}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>
            <Box padding="MS" border="var(--line-3)" radius="MS">
              <Typography variant="title-2" weight="bold">
                결제 금액
              </Typography>
              <div className="pt-ms text-[var(--content-extra-low)]">
                <div className="flex items-center justify-between  pb-xs ">
                  <Typography variant="body-1" weight="regular">
                    시작가
                  </Typography>
                  <Typography variant="body-1" weight="regular">
                    {formatWon(mockOrderDetail.payment.originalPrice)}
                  </Typography>
                </div>
                <div className="flex items-center justify-between pb-s">
                  <Typography variant="body-1" weight="regular">
                    할인 금액
                  </Typography>
                  <Typography variant="body-1" weight="regular">
                    {formatWon(mockOrderDetail.payment.discountPrice)}
                  </Typography>
                </div>
                <div className="flex items-center justify-between  border-t border-[var(--line-line-1,#E5E5E5)] pt-s">
                  <Typography
                    variant="body-1"
                    weight="bold"
                    className="text-[black]"
                  >
                    최종 낙찰 금액
                  </Typography>
                  <Typography
                    variant="body-1"
                    weight="bold"
                    className="text-[var(--btn-primary-default)]"
                  >
                    {formatWon(mockOrderDetail.payment.finalPrice)}
                  </Typography>
                </div>
              </div>
            </Box>
          </div>

          <div className="flex gap-xs">
            <Link href="/" className="flex-1">
              <Button className="w-full" variant="secondary">
                <Typography variant="label-1" weight="medium">
                  홈으로 돌아가기
                </Typography>
              </Button>
            </Link>
            <Button className="flex-1">
              <Typography variant="label-1" weight="medium">
                낙찰 상세 보기
              </Typography>
            </Button>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

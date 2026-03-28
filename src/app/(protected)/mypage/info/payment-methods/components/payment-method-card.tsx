import Image from 'next/image';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// TODO PaymentAvatar PR 승인되면 해당 컴포넌트에 맞게 교체 필요 #68
export type CardBrandCode = 'HYUNDAI' | 'TOSS';

export type PaymentMethod = {
  id: number;
  brandCode: CardBrandCode;
  brand: string;
  maskedNumber: string;
  isPrimary: boolean;
};

const CARD_BRAND_IMAGE: Record<CardBrandCode, string> = {
  HYUNDAI: '/images/temp/hyundai-card.png',
  TOSS: '/images/temp/toss-card.png',
};

export function PaymentMethodCard({
  id,
  brand,
  brandCode,
  maskedNumber,
  isPrimary,
  onSetPrimary,
  onDelete,
}: PaymentMethod & {
  onSetPrimary: (paymentMethodId: number) => void;
  onDelete: (paymentMethodId: number) => void;
}) {
  return (
    <Box as="article" radius="ML" border="#0A0A0A14" paddingY="MS" paddingX="M">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <Image
            src={CARD_BRAND_IMAGE[brandCode]}
            alt={`${brand} 로고`}
            width={30}
            height={47}
            className="h-[47px] w-[30px] rounded-[2px] object-cover"
          />

          <div className="min-w-0">
            <Typography
              as="h2"
              variant="title-2"
              weight="regular"
              className="truncate leading-[1.3] text-[var(--neutral-30)]"
            >
              {brand}
            </Typography>
            <Typography
              variant="caption-2"
              className="mt-1 text-[var(--neutral-30)]"
            >
              {maskedNumber}
            </Typography>
          </div>
        </div>

        {isPrimary ? (
          <Box
            radius="XS"
            paddingX="XS"
            background="var(--orange-95)"
            className="pb-1"
          >
            <Typography
              variant="label-3"
              weight="medium"
              className="text-[var(--orange-45)]"
            >
              주 사용
            </Typography>
          </Box>
        ) : (
          <div className="flex shrink-0 items-center">
            <Button
              type="button"
              size="xsmall"
              variant="secondary"
              className="bg-[#E6E6E6] px-3 py-1 transition-colors hover:bg-[#dcdcdc]"
              onClick={() => onSetPrimary(id)}
            >
              <Typography
                variant="label-3"
                weight="medium"
                className="text-[var(--neutral-30)]"
              >
                주 결제수단으로 변경
              </Typography>
            </Button>
            <Button
              type="button"
              size="xsmall"
              variant="primary"
              onClick={() => onDelete(id)}
              className="bg-transparent hover:bg-transparent active:bg-transparent"
            >
              <Typography
                variant="label-3"
                weight="medium"
                className="text-[var(--red-50)]"
              >
                삭제
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
}

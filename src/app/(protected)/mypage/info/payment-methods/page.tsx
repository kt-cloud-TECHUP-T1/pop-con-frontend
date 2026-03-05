import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type PaymentMethod = {
  id: number;
  brand: string;
  maskedNumber: string;
  isPrimary: boolean;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: true,
  },
  {
    id: 2,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 3,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
  {
    id: 4,
    brand: '현대카드',
    maskedNumber: '****-****-****-1234',
    isPrimary: false,
  },
];

function PaymentMethodCard({ brand, maskedNumber, isPrimary }: PaymentMethod) {
  return (
    <Box
      as="article"
      radius="ML"
      background="DEFAULT"
      border={isPrimary ? 'STRONG_2' : '#a3a3a3'}
      className={['px-6 transition-colors sm:px-8'].join(' ')}
      paddingY="MS"
      paddingX="S"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Typography
            as="h2"
            variant="body-1"
            weight="bold"
            className="text-[var(--neutral-20)]"
          >
            {brand}
          </Typography>
          <Typography variant="body-2" className="text-[var(--neutral-50)]">
            {maskedNumber}
          </Typography>
        </div>

        {isPrimary ? (
          <Typography
            variant="body-1"
            weight="medium"
            className="text-right text-[var(--orange-50)]"
          >
            메인 결제수단
          </Typography>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="text-sm font-medium text-[var(--neutral-40)] transition-colors hover:text-[var(--neutral-20)]"
            >
              메인 결제수단으로 변경
            </button>
            <Button variant="destructive" size="xsmall" className="min-w-0">
              삭제
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
}

export default function MyPageInfoPaymentMethodsPage() {
  return (
    <section className="max-w-[960px]">
      <header className="mb-6">
        <Typography variant="title-2" weight="medium">
          결제수단 관리
        </Typography>
      </header>

      <div className="space-y-6">
        <div className="space-y-6">
          {PAYMENT_METHODS.map((paymentMethod) => (
            <PaymentMethodCard key={paymentMethod.id} {...paymentMethod} />
          ))}
        </div>

        <Box
          as="button"
          radius="LG"
          background="STRONG"
          className="
            flex items-center justify-center flex-col
            w-full min-h-[104px]
            text-[var(--neutral-20)] 
            transition-colors hover:bg-[var(--neutral-90)]
            cursor-pointer"
          paddingY="MS"
        >
          <Icon name="Plus" size={24} className="mb-2" />
          <Typography variant="body-1" weight="regular">
            새 결제수단 등록
          </Typography>
        </Box>
      </div>
    </section>
  );
}

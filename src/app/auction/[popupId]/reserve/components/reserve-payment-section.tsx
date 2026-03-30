'use client';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { getBillingList } from '@/app/api/payment/get-billing-list';

const popupId = 1;
const reservationId = 'TKT50434728';

type BillingCard = {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string; // ISO 날짜 문자열
};

export default function ReservePaymentSection({
  selectedOptionId,
  bidPrice,
}: {
  selectedOptionId: number | null;
  bidPrice: number | null;
}) {
  const [checks, setChecks] = useState([false, false, false]);
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [billingDefault, setBillingDefault] = useState<BillingCard | null>(
    null
  );
  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const data = await getBillingList(accessToken as string);
        const defaultCard =
          data.find((card: BillingCard) => card.isDefault) ?? null;
        setBillingDefault(defaultCard);
      } catch (error) {
        console.error(error);
      }
    };

    if (accessToken) {
      fetchBilling();
    }
  }, [accessToken]);

  const handleCheck = (index: number, checked: boolean) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });
  };

  const handleSubmit = async () => {
    router.push(`/auction/${popupId}/success/${reservationId}`);
  };
  const isAllChecked = checks.every(Boolean) && selectedOptionId !== null;
  return (
    <div className="pt-ms flex flex-col gap-ms">
      <div className="payment flex flex-col gap-s">
        <Typography variant="body-1" weight="bold">
          결제수단
        </Typography>

        <Box
          radius="ML"
          border="[var(--content-high)]"
          paddingX="MS"
          paddingY="S"
          className="min-w-0 w-full flex gap-s items-center justify-between"
        >
          <div className="flex flex-col gap-2xs">
            <Typography variant="label-2" weight="bold">
              {billingDefault?.cardName ?? '기본 결제수단 없음'}
            </Typography>
            <Typography variant="caption-2" weight="regular">
              {billingDefault?.cardNumber ?? ''}
            </Typography>
          </div>
          <Icon
            name="ChevronRight"
            className="text-[var(--content-extra-low)]"
          ></Icon>
        </Box>
      </div>
      <div className="assign flex flex-col gap-s">
        <Typography variant="body-1" weight="bold">
          이용 약관 동의
        </Typography>

        <div className="flex flex-col gap-2xs">
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[0]}
              onCheckedChange={(checked) => handleCheck(0, checked === true)}
            ></Checkbox>
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href="/auction/1">
                전자금융거래 이용약관
              </Link>
              을 동의합니다.
            </Typography>
          </div>
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[1]}
              onCheckedChange={(checked) => handleCheck(1, checked === true)}
            ></Checkbox>
            <Typography variant="body-2" weight="regular">
              (필수){' '}
              <Link className="underline" href="/auction/1">
                개인정보 제 3자 제공
              </Link>
              을 동의합니다.
            </Typography>
          </div>
          <div className="flex gap-xs">
            <Checkbox
              checked={checks[2]}
              onCheckedChange={(checked) => handleCheck(2, checked === true)}
            ></Checkbox>
            <Typography variant="body-2" weight="regular">
              (필수) 등록된 카드로 즉시 결제됨을 확인합니다.
            </Typography>
          </div>
        </div>
      </div>
      <Button disabled={!isAllChecked} onClick={handleSubmit}>
        낙찰하기
      </Button>
    </div>
  );
}

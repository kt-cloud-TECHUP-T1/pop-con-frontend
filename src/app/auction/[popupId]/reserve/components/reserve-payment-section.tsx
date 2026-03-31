'use client';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { getBillingList } from '@/app/api/payment/get-billing-list';
import { postAuctionBid } from '@/lib/api/auction-bid';
import { useAuctionStore } from '@/components/sale-detail/stores/auction-store';
import { snackbar } from '@/components/ui/snackbar';
import { SoldOutModal } from '@/components/sale-detail/info/soldout-modal';

type BillingCard = {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string; // ISO 날짜 문자열
};

export default function ReservePaymentSection({
  selectedOptionId,
}: {
  selectedOptionId: number | null;
}) {
  const [checks, setChecks] = useState([false, false, false]);
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentPrice = useAuctionStore(
    (state) => state.liveData?.currentPrice ?? null
  );
  const [billingDefault, setBillingDefault] = useState<BillingCard | null>(
    null
  );
  const [isSoldOutModalOpen, setIsSoldOutModalOpen] = useState(false);
  const openSoldOutModal = () => {
    setIsSoldOutModalOpen(true);
  };
  const closeSoldOutModal = () => {
    setIsSoldOutModalOpen(false);
    //추후 날짜 재조회 api 호출
  };

  //혹시 민중님이 작성하신 코드인가...??
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

  const handleBidSubmit = async () => {
    //구매요청 api 호출
    if (!accessToken) return;
    if (selectedOptionId === null) return;
    if (currentPrice === null) return;

    const result = await postAuctionBid(
      {
        auctionOptionId: selectedOptionId,
        bidPrice: currentPrice as number,
      },
      accessToken
    );
    //성공 처리
    if (result.code === 'SUCCESS') {
      snackbar.success({
        title: '낙찰 성공!',
        description: '잠시 후 완료 페이지로 이동합니다.',
      });

      setTimeout(() => {
        // router.push(`완료 페이지로 이동`);
        alert(' 낙찰 성공 api 완성 후 완료 페이지로 이동 로직 추가');
      }, 1000);

      return;
    }
    // 2. 매진
    if (result.code === 'AU007') {
      openSoldOutModal();
      return;
    }
    // 3. 그 외 에러
    snackbar.destructive({
      title: result.message,
      description: result.message,
    });
  };

  const isAllChecked = checks.every(Boolean) && selectedOptionId !== null;
  return (
    <>
      <div className="flex flex-col gap-ms">
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
        <Button disabled={!isAllChecked} onClick={handleBidSubmit}>
          낙찰하기
        </Button>
      </div>
      <SoldOutModal isOpen={isSoldOutModalOpen} onClose={closeSoldOutModal} />
    </>
  );
}

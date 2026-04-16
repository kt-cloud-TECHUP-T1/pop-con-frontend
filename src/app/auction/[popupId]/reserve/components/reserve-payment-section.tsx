'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useMyId } from '@/hooks/use-my-id';
import { useApplyPageCollector } from '@/features/anti-macro';
import { getBillingList } from '@/app/api/payment/get-billing-list';
import { postAuctionBid } from '@/lib/api/auction-bid';
import { useAuctionStore } from '@/components/sale-detail/stores/auction-store';
import { snackbar } from '@/components/ui/snackbar';
import { SoldOutModal } from '@/components/sale-detail/info/soldout-modal';
import { cn, quizPassedTokenStorage } from '@/lib/utils';
import { AUCTION_BID_FAIL, AUCTION_BID_SUCCESS } from '@/constants/sale-bid';
import auctionPaymentTerms from '../_data/terms/auction-payment-terms.json';
import AuctionTermsDetailContent, {
  AuctionTermsSection,
} from './auction-terms-detail-content';

type BillingCard = {
  id: number;
  cardName: string;
  cardNumber: string;
  isDefault: boolean;
  registeredAt: string;
};

const auctionTermSections =
  auctionPaymentTerms.sections as AuctionTermsSection[];

export default function ReservePaymentSection({
  selectedOptionId,
}: {
  selectedOptionId: number | null;
}) {
  const [checks, setChecks] = useState([false, false, false]);
  const [expandedTermIndex, setExpandedTermIndex] = useState<number | null>(
    null
  );
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useMyId();
  const { submitSignals } = useApplyPageCollector({
    page: 'dutch-auction-application',
    userId: userId ?? '',
  });
  const currentPrice = useAuctionStore(
    (state) => state.liveData?.currentPrice ?? null
  );
  const auctionId = useAuctionStore(
    (state) => state.liveData?.auctionId ?? null
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
    // 추후 날짜 재조회 api 호출
  };

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

  const handleToggleTerm = (index: number) => {
    setExpandedTermIndex((prev) => (prev === index ? null : index));
  };

  const handleBidSubmit = async () => {
    // 구매요청 api 호출
    if (!accessToken) return;
    if (selectedOptionId === null) return;
    if (currentPrice === null) return;

    await submitSignals();

    const quizPassedToken = quizPassedTokenStorage.get();

    // 프론트에서 보안퀴즈 토큰 유무 확인
    if (!quizPassedToken) {
      snackbar.destructive({
        title: '보안퀴즈 필요',
        description: '보안퀴즈를 다시 진행해주세요.',
      });
      router.back();
      return;
    }

    // 서버에서 보안퀴즈 토큰 진위 검증
    const result = await postAuctionBid(
      {
        auctionOptionId: selectedOptionId,
        bidPrice: currentPrice as number,
      },
      accessToken,
      quizPassedToken
    );

    if (result.code === 'SUCCESS') {
      const reservationId = result.data?.reservationNo;
      quizPassedTokenStorage.remove();
      snackbar.success({
        title: AUCTION_BID_SUCCESS,
        description: '잠시 후 완료 페이지로 이동합니다.',
      });

      setTimeout(() => {
        setTimeout(() => {
          router.push(`/auction/${auctionId}/success/${reservationId}`);
        }, 1000);
      }, 1000);

      return;
    }

    if (result.code === 'AU007') {
      openSoldOutModal();
      return;
    }

    snackbar.destructive({
      title: AUCTION_BID_FAIL,
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
            />
          </Box>
        </div>

        <div className="assign flex flex-col gap-s">
          <Typography variant="body-1" weight="bold">
            이용 약관 동의
          </Typography>

          <div className="flex flex-col gap-2xs">
            <AuctionAgreementItem
              checked={checks[0]}
              isExpanded={expandedTermIndex === 0}
              label="전자금융거래 이용약관"
              suffix="에 동의합니다."
              section={auctionTermSections[0]}
              onCheckedChange={(checked) => handleCheck(0, checked)}
              onToggleExpand={() => handleToggleTerm(0)}
            />
            <AuctionAgreementItem
              checked={checks[1]}
              isExpanded={expandedTermIndex === 1}
              label="개인정보 제3자 제공"
              suffix="에 동의합니다."
              section={auctionTermSections[1]}
              onCheckedChange={(checked) => handleCheck(1, checked)}
              onToggleExpand={() => handleToggleTerm(1)}
            />
            <AuctionAgreementItem
              checked={checks[2]}
              isExpanded={expandedTermIndex === 2}
              label="등록된 카드로 즉시 결제됨"
              suffix="을 확인합니다."
              section={auctionTermSections[2]}
              onCheckedChange={(checked) => handleCheck(2, checked)}
              onToggleExpand={() => handleToggleTerm(2)}
            />
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

function AuctionAgreementItem({
  checked,
  isExpanded,
  label,
  suffix,
  section,
  onCheckedChange,
  onToggleExpand,
}: {
  checked: boolean;
  isExpanded: boolean;
  label: string;
  suffix: string;
  section: AuctionTermsSection;
  onCheckedChange: (checked: boolean) => void;
  onToggleExpand: () => void;
}) {
  return (
    <div>
      <div className="flex gap-xs">
        <Checkbox
          checked={checked}
          onCheckedChange={(nextChecked) =>
            onCheckedChange(nextChecked === true)
          }
        />
        <Typography variant="body-2" weight="regular">
          (필수){' '}
          <button
            type="button"
            className="underline text-left"
            onClick={onToggleExpand}
          >
            {label}
          </button>
          {suffix}
        </Typography>
      </div>
      <div
        className={cn(
          'grid transition-all duration-400',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-3 pb-1 pl-7 pr-1 max-h-[300px] overflow-y-auto">
            <AuctionTermsDetailContent section={section} />
          </div>
        </div>
      </div>
    </div>
  );
}

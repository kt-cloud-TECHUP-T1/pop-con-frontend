'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';
import type { ApiResponse } from '@/types/api/common';
import { TicketDetailCard } from './ticket-detail-card';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';

interface TicketDetail {
  ticketId: number;
  popupId: number;
  ticketNumber: string;
  reservationNo: string | null;
  status: 'ISSUED' | 'USED' | 'CANCELLED';
  displayStatus: string;
  sourceType: 'AUCTION' | 'DRAW';
  sourceId: number;
  entryDate: string;
  entryTime: string;
  issuedAt: string;
  popupTitle: string;
  popupAddress: string;
  thumbnailUrl: string;
  qrValue: string;
  userName: string;
  userPhoneNumber: string;
  userEmail: string;
  paymentMethod: string | null;
  cardName: string | null;
  cardNumber: string | null;
  paidAt: string | null;
  originalPrice: number | null;
  discountAmount: number | null;
  finalPrice: number | null;
}

function TicketDetailSkeleton() {
  return (
    <section className="max-w-[760px] space-y-3 mx-auto">
      <div className="h-9 w-24 rounded bg-[var(--neutral-90)] animate-pulse" />
      <div className="flex gap-3">
        <div className="flex-1 h-[120px] rounded-[var(--radius-ML)] bg-[var(--neutral-90)] animate-pulse" />
        <div className="w-[152px] h-[152px] rounded-[var(--radius-S)] bg-[var(--neutral-90)] animate-pulse" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[116px] rounded-[var(--radius-ML)] bg-[var(--neutral-90)] animate-pulse"
        />
      ))}
    </section>
  );
}

export function TicketDetailClient() {
  const { id: ticketId } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<
    TicketDetail | null | 'not-found' | 'error'
  >(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTicket = async () => {
      try {
        const response = await authFetch(`/api/history/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const result = (await response.json()) as ApiResponse<null>;
          setTicket(result.code === 'T001' ? 'not-found' : 'error');
          return;
        }

        const result = (await response.json()) as ApiResponse<TicketDetail>;
        setTicket(result.data ?? 'not-found');
      } catch {
        setTicket('error');
      }
    };

    fetchTicket();
  }, [accessToken, ticketId]);

  if (ticket === 'not-found') notFound();

  if (ticket === 'error') {
    return (
      <section className="max-w-[760px] mx-auto">
        <PageHeader
          title="내 티켓"
          titleVariant="heading-1"
          titleWeight="bold"
        />
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          티켓 정보를 불러오지 못했어요.
        </div>
      </section>
    );
  }

  if (ticket === null) return <TicketDetailSkeleton />;

  console.log(ticket);

  return (
    <section className="max-w-[760px] space-y-3 mx-auto">
      <PageHeader title="내 티켓" titleVariant="heading-1" titleWeight="bold" />

      {/* 예매 번호 + QR 코드 */}
      <div className="flex gap-3">
        <Box
          radius="ML"
          paddingY="MS"
          className="flex flex-1 flex-col items-center justify-center"
          background="var(--component-default)"
        >
          <Icon name="Ticket" size={32} className="text-[var(--orange-50)]" />
          <Typography
            variant="body-2"
            className="text-[var(--content-extra-low)] mt-2"
          >
            티켓 번호
          </Typography>
          <Typography
            variant="title-1"
            weight="bold"
            className="text-[var(--content-high)]"
          >
            {ticket.ticketNumber}
          </Typography>
        </Box>

        <div className="rounded-[var(--radius-ds-s)] border-4 border-[var(--btn-primary-default)] p-4">
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.qrValue)}`}
            alt="QR 코드"
            width={120}
            height={120}
            loading="eager"
          />
        </div>
      </div>

      <TicketDetailCard
        title="팝업 정보"
        rows={[
          { label: '일시', value: `${ticket.entryDate} ${ticket.entryTime}` },
          { label: '장소', value: `${ticket.popupAddress}` },
        ]}
      />

      <TicketDetailCard
        title="예약자 정보"
        rows={[
          { label: '예약자', value: ticket.userName },
          { label: '연락처', value: ticket.userPhoneNumber },
          { label: '이메일', value: ticket.userEmail },
        ]}
      />

      <TicketDetailCard
        title="결제 정보"
        rows={[
          {
            label: '결제 수단',
            value:
              ticket.cardName && ticket.cardNumber
                ? `${ticket.cardName} ${ticket.cardNumber}`
                : (ticket.paymentMethod ?? '-'),
          },
          {
            label: '결제 금액',
            value:
              ticket.finalPrice != null
                ? `${ticket.finalPrice.toLocaleString('ko-KR')}원`
                : '-',
          },
          {
            label: '결제 일시',
            value: ticket.paidAt
              ? ticket.paidAt.replace('T', ' ').slice(0, 16)
              : '-',
          },
        ]}
      />
    </section>
  );
}

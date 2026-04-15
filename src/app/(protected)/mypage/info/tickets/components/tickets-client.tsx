'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { PageHeader } from '@/components/shared/page-header';
import type { ApiResponse } from '@/types/api/common';
import { TicketCard } from './ticket-card';
import { authFetch } from '../../../lib/auth-fetch';
import { TicketCardSkeleton } from '../../../components/skeletons';

interface Ticket {
  ticketId: number;
  userId: number;
  popupId: number;
  ticketNumber: string;
  reservationNo: string | null;
  status: 'ISSUED' | 'USED' | 'CANCELLED';
  sourceType: 'AUCTION' | 'DRAW';
  sourceId: number;
  entryDate: string;
  entryTime: string;
  issuedAt: string;
  popupTitle: string;
  popupAddress: string;
  thumbnailUrl: string;
  displayStatus: string;
}

interface TicketsResponse {
  content: Ticket[];
  empty: boolean;
}

const TICKETS_PAGE_LIMIT = 0;
const TICKETS_SIZE_LIMIT = 20;

export function TicketsClient() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [isError, setIsError] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTickets = async () => {
      try {
        const response = await authFetch(
          `/api/history/tickets?page=${TICKETS_PAGE_LIMIT}&size=${TICKETS_SIZE_LIMIT}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          setIsError(true);
          return;
        }

        const result = (await response.json()) as ApiResponse<TicketsResponse>;
        setTickets(result.data?.content ?? []);
      } catch {
        setIsError(true);
      }
    };

    fetchTickets();
  }, [accessToken]);

  const renderContent = () => {
    if (isError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          티켓 정보를 불러오지 못했어요.
        </div>
      );
    }

    if (tickets === null) {
      return (
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <TicketCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          보유한 티켓이 없어요.
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {tickets.map((ticket) => (
          <li key={ticket.ticketId}>
            <TicketCard ticket={ticket} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="max-w-[760px] mx-auto">
      <PageHeader title="내 티켓" titleVariant="heading-1" titleWeight="bold" />
      {renderContent()}
    </section>
  );
}

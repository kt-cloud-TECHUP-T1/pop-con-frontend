'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { PageHeader } from '@/components/shared/page-header';
import type { ApiResponse } from '@/types/api/common';
import { TicketCard } from './ticket-card';

interface Ticket {
  ticketId: number;
  popupId: number;
  ticketNumber: string;
  reservationNo: string | null;
  status: 'ISSUED' | 'USED' | 'CANCELLED';
  sourceType: 'AUCTION' | 'DRAW';
  entryDate: string;
  entryTime: string;
}

interface TicketsResponse {
  content: Ticket[];
  empty: boolean;
}

const TICKETS_PAGE_LIMIT = 0;
const TICKETS_SIZE_LIMIT = 20;

function TicketCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[var(--radius-ML)] border border-[var(--neutral-90)] p-4 flex items-center gap-4">
      <div className="w-20 h-[104px] rounded-[var(--radius-S)] bg-[var(--neutral-90)]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-[var(--neutral-90)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--neutral-90)]" />
        <div className="h-3 w-1/3 rounded bg-[var(--neutral-90)]" />
      </div>
    </div>
  );
}

export function TicketsClient() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [isError, setIsError] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTickets = async () => {
      try {
        const response = await fetch(
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

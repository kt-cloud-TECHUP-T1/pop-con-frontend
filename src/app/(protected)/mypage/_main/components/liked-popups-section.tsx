'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { PageHeader } from '@/components/shared/page-header';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';
import { LikedPopup, LikedPopupsData } from '../../types/liked-popup';

const PAGE = 0;
const SIZE = 8;

export function LikedPopupsSection() {
  const [popups, setPopups] = useState<LikedPopup[] | null>(null);
  const [isError, setIsError] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchLikedPopups = async () => {
      try {
        const response = await fetch(
          `/api/history/likes?page=${PAGE}&size=${SIZE}`,
          {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          setIsError(true);
          return;
        }

        const result = (await response.json()) as ApiResponse<LikedPopupsData>;
        setPopups(result.data?.content ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setIsError(true);
      }
    };

    fetchLikedPopups();
    return () => controller.abort();
  }, [accessToken]);

  if (isError) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <PageHeader
          title="찜한 팝업스토어"
          titleVariant="heading-1"
          titleWeight="bold"
        />
        <Link
          href="/mypage/activity/liked-popups"
          className="inline-flex items-center gap-1 text-sm text-[var(--neutral-60)] transition-colors hover:text-[var(--neutral-10)]"
        >
          더보기
          <Icon name="ChevronRightSmall" size={20} />
        </Link>
      </div>

      {popups !== null && popups.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          찜한 팝업스토어가 없어요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          {popups === null
            ? Array.from({ length: SIZE }).map((_, i) => (
                <LikedPopupCardSkeleton key={i} />
              ))
            : popups.map((popup) => (
                <LikedPopupCard
                  key={popup.popupId}
                  title={popup.title}
                  description={popup.supportingText}
                  caption={popup.caption}
                  thumbnailUrl={popup.thumbnailUrl}
                />
              ))}
        </div>
      )}
    </section>
  );

  function LikedPopupCardSkeleton() {
    return (
      <div className="animate-pulse">
        <div className="aspect-[3/4] rounded-[var(--radius-ML)] bg-[var(--neutral-90)]" />
        <div className="mt-2 space-y-1.5">
          <div className="h-4 w-3/4 rounded bg-[var(--neutral-90)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--neutral-90)]" />
          <div className="h-3 w-1/3 rounded bg-[var(--neutral-90)]" />
        </div>
      </div>
    );
  }
}

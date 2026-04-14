'use client';

import { useEffect, useState } from 'react';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';
import type { LikedPopup, LikedPopupsData } from '../../../types/liked-popup';
import { LikedPopupCardSkeleton } from '../../../components/skeletons';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../../lib/auth-fetch';

const PAGE = 0;
const SIZE = 12;

export function LikedPopupsPageClient() {
  const [popups, setPopups] = useState<LikedPopup[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchLikedPopups = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch(
          `/api/history/likes?page=${PAGE}&size=${SIZE}`,
          {
            signal: controller.signal,
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedPopups();
    return () => controller.abort();
  }, [accessToken]);

  if (isError) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
        찜한 팝업스토어를 불러오지 못했어요.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: SIZE }).map((_, i) => (
          <LikedPopupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (popups === null) return null;

  if (popups.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
        찜한 팝업스토어가 없어요.
      </div>
    );
  }

  const handleClick = (popupId: number, phaseType: 'AUCTION' | 'DRAW') => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {popups.map((popup) => (
        <LikedPopupCard
          key={popup.popupId}
          title={popup.title}
          description={popup.supportingText}
          caption={popup.caption}
          thumbnailUrl={popup.thumbnailUrl}
          onClick={() => handleClick(popup.popupId, popup.phase.type)}
        />
      ))}
    </div>
  );
}

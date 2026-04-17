'use client';

import { useQuery } from '@tanstack/react-query';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';
import type { LikedPopup, LikedPopupsData } from '../../../types/liked-popup';
import { LikedPopupCardSkeleton } from '../../../components/skeletons';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../../lib/auth-fetch';
import { usePopupLike } from '@/app/(home)/hooks/use-popup-like';
import { snackbar } from '@/components/ui/snackbar';

const PAGE = 0;
const SIZE = 12;

export const LIKED_POPUPS_QUERY_KEY = ['liked-popups'] as const;

export function LikedPopupsPageClient() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const { handleClickLike } = usePopupLike<LikedPopup>({
    onUnlike: () => snackbar.success({ title: '찜 목록에서 삭제되었습니다.' }),
  });

  const { data: popups, isLoading, isError } = useQuery({
    queryKey: [...LIKED_POPUPS_QUERY_KEY, accessToken],
    queryFn: async ({ signal }) => {
      const response = await authFetch(
        `/api/history/likes?page=${PAGE}&size=${SIZE}`,
        { signal }
      );

      if (!response.ok) throw new Error('Failed to fetch liked popups');

      const result = (await response.json()) as ApiResponse<LikedPopupsData>;
      return result.data?.content ?? [];
    },
    enabled: Boolean(accessToken),
  });

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

  if (!popups) return null;

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
          isLiked={popup.liked}
          description={popup.supportingText}
          caption={popup.caption}
          thumbnailUrl={popup.thumbnailUrl}
          countLike={popup.stats.likeCount}
          countView={popup.stats.viewCount}
          onClickLike={() => handleClickLike(popup)}
          onClick={() => handleClick(popup.popupId, popup.phase.type)}
        />
      ))}
    </div>
  );
}

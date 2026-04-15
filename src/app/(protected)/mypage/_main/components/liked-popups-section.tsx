'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@/components/Icon/Icon';
import { LikedPopupCard } from '@/app/(protected)/mypage/components/liked-popup-card';
import { PageHeader } from '@/components/shared/page-header';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';
import { LikedPopup, LikedPopupsData } from '../../types/liked-popup';
import { LikedPopupCardSkeleton } from '../../components/skeletons';
import { authFetch } from '@/app/(protected)/mypage/lib/auth-fetch';
import { useRouter } from 'next/navigation';
import { LIKED_POPUPS_QUERY_KEY } from '../../activity/liked-popups/components/liked-popups-page-client';
import { snackbar } from '@/components/ui/snackbar';
import { usePopupLike } from '@/app/(home)/hooks/use-popup-like';

const PAGE = 0;
const SIZE = 8;

export function LikedPopupsSection() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const { handleClickLike } = usePopupLike<LikedPopup>({
    onUnlike: () => snackbar.success({ title: '찜 목록에서 삭제되었습니다.' }),
  });

  const { data: popups, isError } = useQuery({
    queryKey: [...LIKED_POPUPS_QUERY_KEY, PAGE, SIZE, accessToken],
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

  const handleBannersClick = (
    popupId: number,
    phaseType: 'AUCTION' | 'DRAW'
  ) => {
    if (phaseType === 'AUCTION') {
      router.push(`/auction/${popupId}`);
    } else {
      router.push(`/draw/${popupId}`);
    }
  };

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

      {isError ? (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          찜한 팝업스토어를 불러오지 못했어요.
        </div>
      ) : popups !== undefined && popups.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-[var(--content-extra-low)]">
          찜한 팝업스토어가 없어요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-2 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          {popups === undefined
            ? Array.from({ length: SIZE }).map((_, i) => (
                <LikedPopupCardSkeleton key={i} />
              ))
            : popups.map((popup: LikedPopup) => (
                <LikedPopupCard
                  key={popup.popupId}
                  title={popup.title}
                  description={popup.supportingText}
                  caption={popup.caption}
                  thumbnailUrl={popup.thumbnailUrl}
                  onClickLike={() => handleClickLike(popup)}
                  onClick={() =>
                    handleBannersClick(popup.popupId, popup.phase.type)
                  }
                />
              ))}
        </div>
      )}
    </section>
  );
}

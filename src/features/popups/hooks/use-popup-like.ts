'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components/ui/snackbar';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { deleteHomePopupLike, postHomePopupLike } from '@/app/(home)/actions';
import { HOME_SECTION_QUERY_KEY } from '@/app/(home)/hooks/use-section-fetch';
import { LIKED_POPUPS_QUERY_KEY } from '@/app/(protected)/mypage/activity/liked-popups/components/liked-popups-page-client';

type PopupLikeBase = {
  popupId: number;
  liked: boolean | null;
  stats: { likeCount: number | null } | null;
};

function isPopupCardItem(
  item: unknown,
  popupId: number
): item is PopupLikeBase {
  if (typeof item !== 'object' || item === null) return false;

  const maybeItem = item as Partial<PopupLikeBase>;

  return (
    maybeItem.popupId === popupId &&
    typeof maybeItem.stats === 'object' &&
    maybeItem.stats !== null &&
    typeof maybeItem.stats.likeCount === 'number'
  );
}

function updatePopupLikeInItems(
  oldItems: unknown,
  popupId: number,
  nextIsLiked: boolean
) {
  if (!Array.isArray(oldItems)) return oldItems;

  return oldItems.map((item) => {
    if (!isPopupCardItem(item, popupId)) return item;

    return {
      ...item,
      liked: nextIsLiked,
      stats: {
        ...item.stats,
        likeCount: Math.max(
          0,
          (item.stats?.likeCount || 0) + (nextIsLiked ? 1 : -1)
        ),
      },
    };
  });
}

export function usePopupLike<T extends PopupLikeBase>(options?: {
  onUnlike?: () => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const updateHomeSectionQueries = (popup: T, nextIsLiked: boolean) => {
    queryClient.setQueriesData(
      { queryKey: HOME_SECTION_QUERY_KEY },
      (oldItems) => updatePopupLikeInItems(oldItems, popup.popupId, nextIsLiked)
    );
  };

  const likeMutation = useMutation({
    mutationFn: (popup: T) => {
      if (!accessToken) {
        throw new Error('LOGIN_REQUIRED');
      }

      return postHomePopupLike(popup.popupId, accessToken);
    },
    onSuccess: (_, popup) => {
      updateHomeSectionQueries(popup, true);
      queryClient.invalidateQueries({ queryKey: LIKED_POPUPS_QUERY_KEY });
    },
    onError: (error) => {
      snackbar.destructive({
        title:
          error instanceof Error && error.message === 'LOGIN_REQUIRED'
            ? '로그인이 필요합니다.'
            : '찜하기 처리에 실패했습니다.',
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (popup: T) => {
      if (!accessToken) {
        throw new Error('LOGIN_REQUIRED');
      }

      return deleteHomePopupLike(popup.popupId, accessToken);
    },
    onSuccess: (_, popup) => {
      updateHomeSectionQueries(popup, false);
      queryClient.invalidateQueries({ queryKey: LIKED_POPUPS_QUERY_KEY });
      options?.onUnlike?.();
    },
    onError: (error) => {
      snackbar.destructive({
        title:
          error instanceof Error && error.message === 'LOGIN_REQUIRED'
            ? '로그인이 필요합니다.'
            : '찜 해제 처리에 실패했습니다.',
      });
    },
  });

  const getLikedPopupState = (popup: T) => ({
    isLiked: popup.liked ?? false,
    likeCount: popup.stats?.likeCount || 0,
  });

  const handleClickLike = (popup: T) => {
    if (likeMutation.isPending || unlikeMutation.isPending) return;

    if (popup.liked ?? false) {
      unlikeMutation.mutate(popup);
      return;
    }

    likeMutation.mutate(popup);
  };

  return {
    getLikedPopupState,
    handleClickLike,
  };
}

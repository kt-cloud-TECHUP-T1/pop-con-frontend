'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { snackbar } from '@/components/ui/snackbar';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { LikedPopupState } from '@/types/popup-like';
import type { BasePopupCard } from '../types';
import { deleteHomePopupLike, postHomePopupLike } from '../actions';

export function usePopupLike<T extends BasePopupCard>() {
  const [likedPopupState, setLikedPopupState] = useState<LikedPopupState>({});
  const accessToken = useAuthStore((state) => state.accessToken);

  const updateLikedPopupState = (popup: T, nextIsLiked: boolean) => {
    setLikedPopupState((prev) => {
      const current = prev[popup.popupId] ?? {
        isLiked: popup.liked ?? false,
        likeCount: popup.stats.likeCount,
      };

      return {
        ...prev,
        [popup.popupId]: {
          isLiked: nextIsLiked,
          likeCount: Math.max(0, current.likeCount + (nextIsLiked ? 1 : -1)),
        },
      };
    });
  };

  const likeMutation = useMutation({
    mutationFn: (popup: T) => {
      if (!accessToken) {
        throw new Error('LOGIN_REQUIRED');
      }

      return postHomePopupLike(popup.popupId, accessToken);
    },
    onSuccess: (_, popup) => {
      updateLikedPopupState(popup, true);
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
      updateLikedPopupState(popup, false);
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

  const getLikedPopupState = (popup: T) => {
    const likedState = likedPopupState[popup.popupId];

    return {
      isLiked: likedState?.isLiked ?? popup.liked ?? false,
      likeCount: likedState?.likeCount ?? popup.stats.likeCount,
    };
  };

  const handleClickLike = (popup: T) => {
    if (likeMutation.isPending || unlikeMutation.isPending) return;

    const { isLiked } = getLikedPopupState(popup);

    if (isLiked) {
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

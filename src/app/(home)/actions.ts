'use server';

import { deletePopupLike } from '@/lib/api/popup/delete-popup-like';
import { postPopupLike } from '@/lib/api/popup/post-popup-like';
import type {
  PopupLikeResponse,
  PopupUnlikeResponse,
} from '@/types/popup/popup-like';

export async function postHomePopupLike(
  popupId: number,
  accessToken: string
): Promise<PopupLikeResponse> {
  return postPopupLike(popupId, accessToken);
}

export async function deleteHomePopupLike(
  popupId: number,
  accessToken: string
): Promise<PopupUnlikeResponse> {
  return deletePopupLike(popupId, accessToken);
}

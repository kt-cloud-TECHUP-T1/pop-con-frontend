'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { updateMyProfileAction } from '@/app/(protected)/mypage/info/profile/settings/actions';
import { snackbar } from '@/components/ui/snackbar';
import {
  PROFILE_ERROR_CODES,
  PROFILE_ERROR_MESSAGE_MAP,
  PROFILE_MESSAGES,
} from '@/features/user/constants/profile';
import { profileNicknameSchema } from '@/features/user/schemas/profile';
import { useAuthStore } from '@/features/auth/stores/auth-store';

const INITIAL_PROFILE_IMAGE = '/images/temp/God-Sang-hyeok.png';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const NICKNAME_MAX_LENGTH = 20;
const NICKNAME_ALLOWED_PATTERN = /[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9_]/g;

interface UseProfileSettingsParams {
  currentNickname?: string;
  currentProfileImage?: string | null;
}

export function useProfileSettings({
  currentNickname = '',
  currentProfileImage = INITIAL_PROFILE_IMAGE,
}: UseProfileSettingsParams = {}) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [nickname, setNickname] = useState(currentNickname);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageFileName, setSelectedImageFileName] = useState<
    string | null
  >(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(
    currentProfileImage
  );
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicateNicknameModalOpen, setIsDuplicateNicknameModalOpen] =
    useState(false);
  const [deleteImage, setDeleteImage] = useState(false);

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleNicknameChange = (value: string) => {
    const nextNickname = value
      .replace(NICKNAME_ALLOWED_PATTERN, '')
      .slice(0, NICKNAME_MAX_LENGTH);

    setNickname(nextNickname);
  };

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageErrorMessage(PROFILE_MESSAGES.ERROR.INVALID_FILE_TYPE);
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageErrorMessage(PROFILE_MESSAGES.ERROR.FILE_SIZE_EXCEEDED);
      event.target.value = '';
      return;
    }

    clearObjectUrl();

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setSelectedImageFile(file);
    setSelectedImageFileName(file.name);
    setPreviewImageSrc(objectUrl);
    setImageErrorMessage('');
    setDeleteImage(false);
  };

  const handleImageRemove = () => {
    clearObjectUrl();
    setSelectedImageFile(null);
    setSelectedImageFileName(null);
    setPreviewImageSrc(null);
    setImageErrorMessage('');
    setDeleteImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    setNickname(currentNickname);
    setPreviewImageSrc(currentProfileImage);
  }, [currentNickname, currentProfileImage]);

  useEffect(() => {
    return () => {
      clearObjectUrl();
    };
  }, []);

  const handleSave = async () => {
    const parsedNickname = profileNicknameSchema.safeParse(nickname);

    if (!parsedNickname.success) {
      snackbar.destructive({
        title: PROFILE_MESSAGES.ERROR.TITLE,
        description: parsedNickname.error.issues[0]?.message,
      });
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    formData.append('nickname', parsedNickname.data);

    if (selectedImageFile) {
      formData.append('file', selectedImageFile);
    }

    if (deleteImage) {
      formData.append('deleteImage', 'true');
    }

    try {
      const result = await updateMyProfileAction(accessToken, formData);

      if (result.code === 'SUCCESS' && result.data) {
        snackbar.success({
          title: PROFILE_MESSAGES.SUCCESS.TITLE,
          description: PROFILE_MESSAGES.SUCCESS.DESCRIPTION,
        });
        setSelectedImageFile(null);
        setSelectedImageFileName(null);
        setDeleteImage(false);
        setNickname(result.data.nickname);
        setPreviewImageSrc(result.data.profileImage ?? null);
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        return;
      }

      if (result.code === PROFILE_ERROR_CODES.USER.DUPLICATE_NICKNAME) {
        setIsDuplicateNicknameModalOpen(true);
        return;
      }

      snackbar.destructive({
        title: PROFILE_MESSAGES.ERROR.TITLE,
        description:
          PROFILE_ERROR_MESSAGE_MAP[result.code] ??
          result.message ??
          PROFILE_MESSAGES.ERROR.DEFAULT,
      });
    } catch (error) {
      console.error('[useProfileSettings/handleSave]', error);
      snackbar.destructive({
        title: PROFILE_MESSAGES.ERROR.TITLE,
        description: PROFILE_MESSAGES.ERROR.DEFAULT,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    nickname,
    setNickname: handleNicknameChange,
    previewImageSrc,
    selectedImageFileName,
    imageErrorMessage,
    fileInputRef,
    isSaving,
    isDuplicateNicknameModalOpen,
    setIsDuplicateNicknameModalOpen,
    openImagePicker,
    handleImageFileChange,
    handleImageRemove,
    handleSave,
  };
}

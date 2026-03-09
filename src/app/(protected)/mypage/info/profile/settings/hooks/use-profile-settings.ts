'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

const INITIAL_PROFILE_IMAGE = '/images/temp/God-Sang-hyeok.png';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [nickname, setNickname] = useState('심심한 고래');
  const [selectedImageFileName, setSelectedImageFileName] = useState<
    string | null
  >(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(
    INITIAL_PROFILE_IMAGE
  );
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openImagePicker = () => {
    fileInputRef.current?.click();
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
      setImageErrorMessage('JPG, PNG, WEBP 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageErrorMessage('이미지 용량은 5MB 이하만 가능합니다.');
      event.target.value = '';
      return;
    }

    clearObjectUrl();

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setSelectedImageFileName(file.name);
    setPreviewImageSrc(objectUrl);
    setImageErrorMessage('');
  };

  const handleImageRemove = () => {
    clearObjectUrl();
    setSelectedImageFileName(null);
    setPreviewImageSrc(null);
    setImageErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      clearObjectUrl();
    };
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    try {
      // TODO: API 연결 시 이 핸들러에서 nickname / image 저장 요청을 처리
    } finally {
      setIsSaving(false);
    }
  };

  return {
    nickname,
    setNickname,
    previewImageSrc,
    selectedImageFileName,
    imageErrorMessage,
    fileInputRef,
    isSaving,
    openImagePicker,
    handleImageFileChange,
    handleImageRemove,
    handleSave,
  };
}

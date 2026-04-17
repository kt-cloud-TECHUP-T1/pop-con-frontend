'use client';

import type { ChangeEvent, RefObject } from 'react';
import Image from 'next/image';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

interface ProfileSettingsFormSectionProps {
  nickname: string;
  onNicknameChange: (value: string) => void;
  previewImageSrc: string | null;
  selectedImageFileName: string | null;
  imageErrorMessage: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImagePickerOpen: () => void;
  onImageRemove: () => void;
}

export function ProfileSettingsFormSection({
  nickname,
  onNicknameChange,
  previewImageSrc,
  selectedImageFileName,
  imageErrorMessage,
  fileInputRef,
  onImageFileChange,
  onImagePickerOpen,
  onImageRemove,
}: ProfileSettingsFormSectionProps) {
  const nicknameInputId = 'profile-nickname';

  return (
    <Box as="article" radius="ML" border="#0A0A0A14" padding="ML">
      <div className="grid gap-8">
        <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,400px)] sm:items-center">
          <label htmlFor={nicknameInputId}>
            <Typography variant="title-2" weight="medium">
              닉네임
            </Typography>
          </label>
          <Input
            id={nicknameInputId}
            inputSize="medium"
            placeholder="한글, 영문, 숫자, 2~20자"
            maxLength={20}
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,400px)]">
          <Typography variant="title-2" weight="medium" className="sm:pt-2">
            프로필 이미지
          </Typography>

          <div className="space-y-4">
            <Box
              radius="FULL"
              className="h-22 w-22 overflow-hidden bg-gray-100 flex items-center justify-center"
            >
              {previewImageSrc ? (
                <Image
                  src={previewImageSrc}
                  alt="프로필 이미지 미리보기"
                  width={88}
                  height={88}
                  unoptimized={previewImageSrc.startsWith('blob:')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Typography variant="label-2" className="text-gray-500">
                  이미지 없음
                </Typography>
              )}
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              aria-label="프로필 이미지 파일 선택"
              onChange={onImageFileChange}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="tertiary"
                size="medium"
                onClick={onImagePickerOpen}
              >
                이미지 변경
              </Button>
              <Button
                type="button"
                variant="tertiary"
                size="medium"
                onClick={onImageRemove}
              >
                이미지 삭제
              </Button>
            </div>

            {imageErrorMessage && (
              <Typography variant="label-2" className="text-red-600">
                {imageErrorMessage}
              </Typography>
            )}

            {selectedImageFileName && (
              <Typography variant="label-2" className="text-gray-500">
                선택한 파일: {selectedImageFileName}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}

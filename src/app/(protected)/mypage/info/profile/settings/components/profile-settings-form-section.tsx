'use client';

import type { ChangeEvent, RefObject } from 'react';
import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';
import Image from 'next/image';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

interface ProfileSettingsFormSectionProps {
  nicknameDefaultValue: string;
  previewImageSrc: string | null;
  selectedImageFileName: string | null;
  imageErrorMessage: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImagePickerOpen: () => void;
  onImageRemove: () => void;
}

export function ProfileSettingsFormSection({
  nicknameDefaultValue,
  previewImageSrc,
  selectedImageFileName,
  imageErrorMessage,
  fileInputRef,
  onImageFileChange,
  onImagePickerOpen,
  onImageRemove,
}: ProfileSettingsFormSectionProps) {
  return (
    <>
      <MyPageHeader
        title="프로필 설정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <Box as="article" radius="ML" border="#0A0A0A14" className="p-8 sm:p-10">
        <div className="grid gap-8">
          <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,400px)] sm:items-center">
            <Typography variant="title-2" weight="medium">
              닉네임
            </Typography>
            <Input
              inputSize="medium"
              placeholder="한글 2~10자, 영문 16자 이내만 가능합니다."
              defaultValue={nicknameDefaultValue}
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
                    alt="프로필 이미지"
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
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={onImageFileChange}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="tertiary"
                  size="large"
                  onClick={onImagePickerOpen}
                >
                  이미지 변경
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  size="large"
                  onClick={onImageRemove}
                >
                  이미지 삭제
                </Button>
              </div>

              <Typography variant="label-2" className="text-gray-500">
                JPG, PNG, WEBP / 최대 5MB
              </Typography>

              {imageErrorMessage && (
                <Typography variant="label-2" className="text-red-600">
                  {imageErrorMessage}
                </Typography>
              )}

              {selectedImageFileName && (
                <Typography variant="label-2" className="text-gray-500">
                  선택된 파일: {selectedImageFileName}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

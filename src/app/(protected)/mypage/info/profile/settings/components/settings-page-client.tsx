'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { ProfileSettingsFormSection } from '@/app/(protected)/mypage/info/profile/settings/components/profile-settings-form-section';
import { useProfileSettings } from '@/app/(protected)/mypage/info/profile/settings/hooks/use-profile-settings';

export function SettingsPageClient() {
  const {
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
  } = useProfileSettings();

  return (
    <section>
      <ProfileSettingsFormSection
        nickname={nickname}
        onNicknameChange={setNickname}
        previewImageSrc={previewImageSrc}
        selectedImageFileName={selectedImageFileName}
        imageErrorMessage={imageErrorMessage}
        fileInputRef={fileInputRef}
        onImageFileChange={handleImageFileChange}
        onImagePickerOpen={openImagePicker}
        onImageRemove={handleImageRemove}
      />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/mypage/info/profile"
          className={buttonVariants({ variant: 'secondary', size: 'large', className: 'min-w-[200px]' })}
        >
          취소
        </Link>
        <Button
          type="button"
          size="large"
          className="min-w-[200px]"
          onClick={handleSave}
          disabled={isSaving}
        >
          저장
        </Button>
      </div>
    </section>
  );
}

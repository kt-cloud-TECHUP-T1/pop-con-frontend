'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { NicknameDuplicateModal } from '@/app/(protected)/mypage/info/profile/settings/components/nickname-duplicate-modal';
import { ProfileSettingsFormSection } from '@/app/(protected)/mypage/info/profile/settings/components/profile-settings-form-section';
import { useProfileSettings } from '@/app/(protected)/mypage/info/profile/settings/hooks/use-profile-settings';
import { useUserMeQuery } from '@/features/user/queries/use-user-me-query';

export function SettingsPageClient() {
  const { data: userMe } = useUserMeQuery();
  const {
    nickname,
    setNickname,
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
  } = useProfileSettings({
    currentNickname: userMe?.nickname ?? '',
    currentProfileImage: userMe?.profileImage ?? null,
  });

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
          className={buttonVariants({
            variant: 'secondary',
            size: 'large',
            className: 'min-w-[200px]',
          })}
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
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>

      <NicknameDuplicateModal
        open={isDuplicateNicknameModalOpen}
        onClose={() => setIsDuplicateNicknameModalOpen(false)}
      />
    </section>
  );
}

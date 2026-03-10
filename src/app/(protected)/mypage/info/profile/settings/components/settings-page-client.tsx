'use client';

import { ProfileSettingsActions } from '@/app/(protected)/mypage/info/profile/settings/components/profile-settings-actions';
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
      <ProfileSettingsActions
        cancelHref="/mypage/info/profile"
        onSave={handleSave}
        isSaving={isSaving}
      />
    </section>
  );
}

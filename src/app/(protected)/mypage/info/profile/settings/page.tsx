import { SettingsPageClient } from '@/app/(protected)/mypage/info/profile/settings/components/settings-page-client';
import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';

export default function MyPageSettingsPage() {
  return (
    <>
      <MyPageHeader
        title="프로필 설정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <SettingsPageClient />
    </>
  );
}

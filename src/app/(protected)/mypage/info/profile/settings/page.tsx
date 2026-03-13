import { SettingsPageClient } from '@/app/(protected)/mypage/info/profile/settings/components/settings-page-client';
import { PageHeader } from '@/components/shared/page-header';

export default function MyPageSettingsPage() {
  return (
    <>
      <PageHeader
        title="프로필 설정"
        titleVariant="heading-1"
        titleWeight="bold"
      />
      <SettingsPageClient />
    </>
  );
}

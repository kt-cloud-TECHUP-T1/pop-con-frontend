import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';

export default function MyPageOthersSettingsPage() {
  return (
    <section>
      <MyPageHeader
        title="설정"
        titleVariant="heading-1"
        titleWeight="bold"
        description="설정 페이지"
      />
    </section>
  );
}

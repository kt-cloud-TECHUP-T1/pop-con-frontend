import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';

export default function SupportPage() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-6 py-10 md:px-10">
      <MyPageHeader
        title="고객센터"
        titleVariant="heading-1"
        titleWeight="bold"
        description="고객센터 페이지"
      />
    </section>
  );
}

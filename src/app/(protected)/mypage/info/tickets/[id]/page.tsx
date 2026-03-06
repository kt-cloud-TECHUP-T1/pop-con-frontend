import { notFound } from 'next/navigation';
import { MyPageHeader } from '@/app/(protected)/mypage/components/page-header';

type TicketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MyPageTicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  return (
    <section className="max-w-[920px]">
      <MyPageHeader
        title="내 티켓"
        titleVariant="heading-1"
        titleWeight="bold"
        description="티켓 상세 페이지"
      />
    </section>
  );
}

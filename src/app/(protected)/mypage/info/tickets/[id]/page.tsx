import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { Icon } from '@/components/Icon/Icon';

type TicketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// TODO: 실제 API로 교체 필요
const TICKET_MOCK = {
  reservationNumber: 'TKT77430017',
  performance: {
    dateTime: '2026.02.19 11:00',
    location: '팝업스토어 강남점',
  },
  reservee: {
    name: '김팝콘',
    phone: '010-12**-56**',
    email: 'po****@naver.com',
  },
  payment: {
    method: '현대카드 (****-1234)',
    amount: '132,000원',
    paidAt: '2026. 3. 2. 오전 12:03:50',
  },
};

function TicketDetailCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <Box as="section" radius="ML" border="var(--line-3)" padding="MS">
      <Typography variant="title-2" weight="bold" className="mb-4">
        {title}
      </Typography>
      <dl className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt>
              <Typography
                variant="body-2"
                className="text-[var(--content-extra-low)]"
              >
                {label}
              </Typography>
            </dt>
            <dd>
              <Typography
                variant="body-2"
                weight="medium"
                className="text-[var(--content-high)]"
              >
                {value}
              </Typography>
            </dd>
          </div>
        ))}
      </dl>
    </Box>
  );
}

export default async function MyPageTicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const ticket = TICKET_MOCK;

  return (
    <section className="max-w-[760px] space-y-3 mx-auto">
      <PageHeader title="내 티켓" titleVariant="heading-1" titleWeight="bold" />

      {/* 예매 번호 + QR 코드 */}
      <div className="flex gap-3">
        <Box
          radius="ML"
          paddingY="MS"
          className="flex flex-1 flex-col items-center justify-center"
          background="var(--component-default)"
        >
          <Icon name="Ticket" size={32} className="text-[var(--orange-50)]" />
          <Typography
            variant="body-2"
            className="text-[var(--content-extra-low)] mt-2"
          >
            예매 번호
          </Typography>
          <Typography
            variant="title-1"
            weight="bold"
            className="text-[var(--content-high)]"
          >
            {ticket.reservationNumber}
          </Typography>
        </Box>

        <div className="rounded-[var(--radius-s)] border-4 border-[var(--btn-primary-default)] p-4">
          <Image
            src="/images/temp/qr-code.png"
            alt="QR 코드"
            width={120}
            height={120}
            loading="eager"
          />
        </div>
      </div>

      <TicketDetailCard
        title="공연 정보"
        rows={[
          { label: '일시', value: ticket.performance.dateTime },
          { label: '장소', value: ticket.performance.location },
        ]}
      />

      <TicketDetailCard
        title="예약자 정보"
        rows={[
          { label: '예약자', value: ticket.reservee.name },
          { label: '연락처', value: ticket.reservee.phone },
          { label: '이메일', value: ticket.reservee.email },
        ]}
      />

      <TicketDetailCard
        title="결제 정보"
        rows={[
          { label: '결제 수단', value: ticket.payment.method },
          { label: '결제 금액', value: ticket.payment.amount },
          { label: '결제 일시', value: ticket.payment.paidAt },
        ]}
      />
    </section>
  );
}

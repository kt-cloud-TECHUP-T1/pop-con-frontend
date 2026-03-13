import { PageHeader } from '@/components/shared/page-header';
import { Icon } from '@/components/Icon/Icon';
import { Typography } from '@/components/ui/typography';
import { Box } from '@/components/ui/box';
import { ThumbnailImage } from '@/components/content/thumbnail-image';

type MyTicketItem = {
  id: number;
  title: string;
  dateTime: string;
  address: string;
  reservationNumber: string;
  href: string;
};

const myTickets: MyTicketItem[] = [
  {
    id: 1,
    title: 'T1 팝업 스토어',
    dateTime: '2026.03.14(토) 오후 1:30',
    address: '서울 영등포구 여의대로 108, 더현대 서울',
    reservationNumber: 'TKT50434728',
    href: '/mypage/info/tickets/1',
  },
  {
    id: 2,
    title: 'T1 팝업 스토어',
    dateTime: '2026.03.14(토) 오후 1:30',
    address: '서울 영등포구 여의대로 108, 더현대 서울',
    reservationNumber: 'TKT50434728',
    href: '/mypage/info/tickets/2',
  },
  {
    id: 3,
    title: 'T1 팝업 스토어',
    dateTime: '2026.03.14(토) 오후 1:30',
    address: '서울 영등포구 여의대로 108, 더현대 서울',
    reservationNumber: 'TKT50434728',
    href: '/mypage/info/tickets/3',
  },
];

export default function MyPageInfoTicketsPage() {
  return (
    <section>
      <PageHeader
        title="내 티켓"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <ul className="space-y-3">
        {myTickets.map((ticket) => (
          <li key={ticket.id}>
            <Box
              as="a"
              href={ticket.href}
              radius="ML"
              border="--neutral-90"
              padding="M"
              className="flex items-center gap-4 transition-colors hover:border-[var(--neutral-70)]"
            >
              <ThumbnailImage width={80} height={104} radius="S" />

              <div className="min-w-0 flex-1">
                <Typography variant="title-2" weight="medium" className="mb-2">
                  {ticket.title}
                </Typography>
                <Typography
                  variant="caption-1"
                  className="text-[var(--neutral-60)]"
                >
                  {ticket.dateTime}
                </Typography>
                <Typography
                  as="p"
                  variant="caption-1"
                  className="text-[var(--neutral-60)] mb-1"
                >
                  {ticket.address}
                </Typography>
                <Typography
                  variant="caption-1"
                  className="text-[var(--neutral-60)]"
                >
                  예약번호: {ticket.reservationNumber}
                </Typography>
              </div>

              <Icon name="ChevronRight" size={32} className="shrink-0 " />
            </Box>
          </li>
        ))}
      </ul>
    </section>
  );
}

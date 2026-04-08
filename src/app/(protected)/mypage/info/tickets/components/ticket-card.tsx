import { Icon } from '@/components/Icon/Icon';
import { Box } from '@/components/ui/box';
import { Typography } from '@/components/ui/typography';
import { ThumbnailImage } from '@/components/content/thumbnail-image';

interface Ticket {
  ticketId: number;
  reservationNo: string | null;
  ticketNumber: string;
  sourceType: 'AUCTION' | 'DRAW';
  entryDate: string;
  entryTime: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const isAuction = ticket.sourceType === 'AUCTION';

  const content = (
    <>
      <ThumbnailImage width={80} height={104} radius="S" />

      <div className="min-w-0 flex-1">
        <Typography variant="title-2" weight="medium" className="mb-2">
          TODO: 팝업 이름 API 연동 필요
        </Typography>
        <Typography variant="caption-1" className="text-[var(--neutral-60)]">
          {ticket.entryDate} {ticket.entryTime}
        </Typography>
        <Typography
          as="p"
          variant="caption-1"
          className="text-[var(--neutral-60)] mb-1"
        >
          TODO: 팝업 장소 API 연동 필요
        </Typography>
        <Typography variant="caption-1" className="text-[var(--neutral-60)]">
          {isAuction
            ? `예약번호: ${ticket.reservationNo}`
            : `티켓번호: ${ticket.ticketNumber}`}
        </Typography>
      </div>

      {isAuction && <Icon name="ChevronRight" size={24} className="shrink-0" />}
    </>
  );

  const boxClassName = "flex items-center gap-4";

  if (isAuction && ticket.reservationNo) {
    return (
      <Box
        as="a"
        href={`/mypage/info/tickets/${ticket.reservationNo}`}
        radius="ML"
        border="--neutral-90"
        padding="M"
        className={boxClassName}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      radius="ML"
      border="--neutral-90"
      padding="M"
      className={boxClassName}
    >
      {content}
    </Box>
  );
}

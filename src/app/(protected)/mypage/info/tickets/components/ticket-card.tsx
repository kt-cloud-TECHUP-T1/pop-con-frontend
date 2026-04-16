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
  popupTitle: string;
  popupAddress: string;
  thumbnailUrl: string;
  displayStatus: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  console.log(ticket);
  const isAuction = ticket.sourceType === 'AUCTION';

  const content = (
    <>
      <ThumbnailImage
        src={ticket.thumbnailUrl}
        width={80}
        height={104}
        radius="S"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Typography variant="title-2" weight="medium" className="truncate">
            {ticket.popupTitle}
          </Typography>
        </div>
        <Typography variant="caption-1" className="text-[var(--neutral-60)]">
          {ticket.entryDate} {ticket.entryTime}
        </Typography>
        <Typography
          as="p"
          variant="caption-1"
          className="text-[var(--neutral-60)] mb-1"
        >
          {ticket.popupAddress}
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

  const boxClassName = 'flex items-center gap-4';

  return (
    <Box
      as="a"
      href={`/mypage/info/tickets/${ticket.ticketId}`}
      radius="ML"
      border="--neutral-90"
      padding="M"
      className={boxClassName}
    >
      {content}
    </Box>
  );
}

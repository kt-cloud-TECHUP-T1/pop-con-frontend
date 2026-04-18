export type DrawResultType = 'WINNER' | 'FAILED';

export type DrawTicketStatus = 'ISSUED' | string;

export type DrawTicketSourceType = 'DRAW' | string;

export interface DrawTicket {
  ticketId: number;
  ticketNumber: string;
  reservationNo: string | null;
  status: DrawTicketStatus;
  sourceType: DrawTicketSourceType;
  sourceId: number;
}

export interface ConfirmDrawResultResponse {
  drawEntryId: number;
  drawId: number;
  resultType: DrawResultType;
  hasTicket: boolean;
  announcementAt: string;
  resultCheckedAt: string;
  winningRatePercent: string | null;
  ticket: DrawTicket | null;
}

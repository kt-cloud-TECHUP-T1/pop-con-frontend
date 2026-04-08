export interface AuctionSlot {
  optionId: number;
  entryTime: string;
  remainingStock: number;
  pendingStock: number;
  selectable: boolean;
}

export interface DrawSlot {
  optionId: number;
  entryTime: string;
}

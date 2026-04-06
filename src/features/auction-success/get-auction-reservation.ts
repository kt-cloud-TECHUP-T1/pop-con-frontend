import { GetAuctionReservationResponse } from '@/types/auction-success/auction-success';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getAuctionReservation(
  reservationNo: string,
  accessToken: string
): Promise<GetAuctionReservationResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auctions/reservations/${reservationNo}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    const result: GetAuctionReservationResponse = await response.json();

    return result;
  } catch {
    return {
      code: 'S001',
      message: '시스템 오류가 발생했습니다.',
      data: null,
    };
  }
}

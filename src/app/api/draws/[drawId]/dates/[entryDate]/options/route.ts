import {
  // TODO 테스트 후 주석 제거
  // createUnauthorizedResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function GET(
  _request: Request, // TODO 테스트 후 request로 복구
  { params }: { params: Promise<{ drawId: string; entryDate: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  // TODO 테스트 후 주석 제거
  // const authorization = _request.headers.get('Authorization');
  const { drawId, entryDate } = await params;

  // TODO 테스트 후 주석 제거
  // if (!authorization) {
  //   return createUnauthorizedResponse();
  // }

  try {
    const response = await fetch(
      `${API_BASE_URL}/draws/${drawId}/dates/${entryDate}/options`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO 테스트 후 주석 제거
          // Authorization: authorization,
        },
      }
    );

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/draws/[drawId]/dates/[entryDate]/options]', error);
    return createServerErrorResponse();
  }
}

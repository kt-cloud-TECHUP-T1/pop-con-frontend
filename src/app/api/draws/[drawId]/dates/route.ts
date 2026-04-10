import {
  createUnauthorizedResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('draw');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ drawId: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const authorization = request.headers.get('Authorization');
  const quizPassedToken = request.headers.get('X-Quiz-Passed-Token');
  const { drawId } = await params;

  if (!authorization || !quizPassedToken) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/draws/${drawId}/dates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
        'X-Quiz-Passed-Token': quizPassedToken,
      },
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[GET /api/draws/[drawId]/dates]', error);
    return createServerErrorResponse();
  }
}

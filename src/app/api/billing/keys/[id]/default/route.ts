import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }

  const { id } = await params;

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/billing/keys/${id}/default`, {
      method: 'PATCH',
      headers: {
        Authorization: authorization,
      },
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[PATCH /api/billing/keys/[id]/default]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}

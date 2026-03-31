import {
  createServerErrorResponse,
  createUnauthorizedResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function DELETE(
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
    const response = await fetch(`${API_BASE_URL}/billing/keys/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[DELETE /api/billing/keys/[id]]', error);
    return createServerErrorResponse('시스템 오류가 발생했습니다.');
  }
}

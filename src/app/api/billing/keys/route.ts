import {
  createUnauthorizedResponse,
  createBadRequestResponse,
  createServerErrorResponse,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

export async function POST(request: Request) {
  const authorization = request.headers.get('Authorization');
  const body = await request.json();

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  if (!body.customerUid) {
    return createBadRequestResponse({
      customerUid: '빌링키 식별자는 필수입니다.',
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/billing/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({
        customerUid: body.customerUid,
      }),
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[billing/keys]', error);
    return createServerErrorResponse();
  }
}

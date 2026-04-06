import {
  createUnauthorizedResponse,
  createBadRequestResponse,
  createServerErrorResponse,
  handleProxyResponse,
  getServiceBaseUrl,
} from '@/app/api/shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('user');

type BillingKeysRequestBody = {
  customerUid?: string;
};

export async function POST(request: Request) {
  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  let body: BillingKeysRequestBody = {};

  try {
    body = (await request.json()) as BillingKeysRequestBody;
  } catch {
    return createBadRequestResponse({
      customerUid: '빌링키 식별자는 필수입니다.',
    });
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

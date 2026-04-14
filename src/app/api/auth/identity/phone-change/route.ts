import { NextRequest } from 'next/server';
import { AUTH_MESSAGES } from '@/constants/auth';
import {
  createBadRequestResponse,
  createServerErrorResponse,
  createUnauthorizedResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '@/app/api/shared/route-helpers';

type PhoneChangeRequestBody = {
  identityVerificationId?: string;
};

const API_BASE_URL = getServiceBaseUrl('auth');

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  let identityVerificationId = '';

  try {
    const body = (await request.json()) as PhoneChangeRequestBody;
    identityVerificationId = body.identityVerificationId?.trim() ?? '';
  } catch {
    return createBadRequestResponse({
      identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
    });
  }

  if (!identityVerificationId) {
    return createBadRequestResponse({
      identityVerificationId: AUTH_MESSAGES.IDENTITY.ERROR.REQUIRED_ID,
    });
  }

  if (!authorization) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/identity/phone-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify({ identityVerificationId }),
      cache: 'no-store',
    });

    return handleProxyResponse(response);
  } catch (error) {
    console.error('[identity/phone-change]', error);
    return createServerErrorResponse();
  }
}

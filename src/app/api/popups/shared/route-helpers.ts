import { NextResponse } from 'next/server';
import { API_ERROR_CODES, API_RESPONSE_CODE } from '@/constants/api';
import type { PopupSectionApiResponse } from '@/types/api/home';

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const normalizedBaseUrl = NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

type ProxyPopupSectionRequestParams = {
  request: Request;
  searchParams: URLSearchParams;
  endpoint: string;
  missingBaseUrlMessage: string;
  unavailableResponseMessage: string;
  requestFailureMessage: string;
};

type ParseLimitParams = {
  searchParams: URLSearchParams;
  defaultLimit: number;
  minLimit: number;
  maxLimit?: number;
};

type InvalidLimitResponseParams = {
  message: string;
  limitMessage: string;
};

type SuccessResponseParams<T> = {
  message: string;
  data: T;
};

type InternalServerErrorParams = {
  message: string;
};

export function parseLimit({
  searchParams,
  defaultLimit,
  minLimit,
  maxLimit,
}: ParseLimitParams) {
  const rawLimit = searchParams.get('limit');

  if (rawLimit === null) {
    return defaultLimit;
  }

  const limit = Number(rawLimit);
  const isValidInteger = Number.isInteger(limit);
  const isUnderMinLimit = limit < minLimit;
  const isOverMaxLimit = maxLimit !== undefined && limit > maxLimit;

  if (!isValidInteger || isUnderMinLimit || isOverMaxLimit) {
    return null;
  }

  return limit;
}

export function createInvalidLimitResponse({
  message,
  limitMessage,
}: InvalidLimitResponseParams) {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.COMMON.BAD_REQUEST,
      message,
      data: {
        limit: limitMessage,
      },
    },
    { status: 400 }
  );
}

export function createPopupSectionSuccessResponse<T>({
  message,
  data,
}: SuccessResponseParams<T>) {
  return NextResponse.json(
    {
      code: API_RESPONSE_CODE.STATUS.SUCCESS,
      message,
      data,
    },
    { status: 200 }
  );
}

export function createInternalServerErrorResponse({
  message,
}: InternalServerErrorParams) {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
      message,
      data: null,
    },
    { status: 500 }
  );
}

export function buildPopupSectionProxyUrl(
  endpoint: string,
  searchParams: URLSearchParams,
  missingBaseUrlMessage: string
) {
  if (!NEXT_PUBLIC_API_BASE_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(missingBaseUrlMessage);
    }

    return null;
  }

  const queryString = searchParams.toString();

  return queryString
    ? `${normalizedBaseUrl}${endpoint}?${queryString}`
    : `${normalizedBaseUrl}${endpoint}`;
}

export function hasPopupSectionItems(response: PopupSectionApiResponse) {
  return Array.isArray(response.data?.items) && response.data.items.length > 0;
}

export async function proxyPopupSectionRequest({
  request,
  searchParams,
  endpoint,
  missingBaseUrlMessage,
  unavailableResponseMessage,
  requestFailureMessage,
}: ProxyPopupSectionRequestParams) {
  const proxyUrl = buildPopupSectionProxyUrl(
    endpoint,
    searchParams,
    missingBaseUrlMessage
  );

  if (!proxyUrl) {
    return null;
  }

  const cookie = request.headers.get('cookie');

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
      cache: 'no-store',
    });

    const responseBody = (await response.json()) as PopupSectionApiResponse;

    if (!response.ok || !hasPopupSectionItems(responseBody)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(unavailableResponseMessage);
      }

      return null;
    }

    return NextResponse.json(responseBody, { status: response.status });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(requestFailureMessage, error);
    }

    return null;
  }
}

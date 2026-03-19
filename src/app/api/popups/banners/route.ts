import { NextResponse } from 'next/server';
import { mockBannerItems } from '@/app/api/popups/banners/data/mock-banner-items';
import { API_ERROR_CODES, API_RESPONSE_CODE } from '@/constants/api';
import type {
  PopupSectionApiResponse,
  PopupSectionResponse,
} from '@/types/api/home';

const DEFAULT_LIMIT = 5;
const MIN_LIMIT = 1;
const MAX_LIMIT = 5;
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const normalizedBaseUrl = NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

// 백엔드 배너 응답을 우선 사용하고, 실패하면 mock 데이터로 대체
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams);

    if (limit === null) {
      return createInvalidLimitResponse();
    }

    const proxiedResponse = await proxyBannerRequest(request, searchParams);

    if (proxiedResponse) {
      return proxiedResponse;
    }

    // 백엔드 응답을 사용할 수 없으면 로컬 mock 데이터를 대신 내려줌
    return createBannerSectionResponse(buildBannerSection(limit));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
        message: '시스템 오류가 발생했습니다.',
        data: null,
      },
      { status: 500 }
    );
  }
}

// limit 쿼리를 파싱하고 허용 범위를 벗어나면 null을 반환
function parseLimit(searchParams: URLSearchParams) {
  const rawLimit = searchParams.get('limit');

  if (rawLimit === null) {
    return DEFAULT_LIMIT;
  }

  const limit = Number(rawLimit);
  const isValidInteger = Number.isInteger(limit);

  if (!isValidInteger || limit < MIN_LIMIT || limit > MAX_LIMIT) {
    return null;
  }

  return limit;
}
// 잘못된 limit 쿼리에 대한 400 응답을 생성
function createInvalidLimitResponse() {
  return NextResponse.json(
    {
      code: API_ERROR_CODES.COMMON.BAD_REQUEST,
      message: '입력값이 올바르지 않습니다.',
      data: {
        limit: 'limit는 1 이상 5 이하여야 합니다.',
      },
    },
    { status: 400 }
  );
}

// 백엔드 배너 API 요청 URL을 만들고, base URL이 없으면 null을 반환
function buildProxyUrl(searchParams: URLSearchParams) {
  if (!NEXT_PUBLIC_API_BASE_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[popups/banners] NEXT_PUBLIC_API_BASE_URL가 설정되지 않았습니다. 목 배너 데이터로 대체합니다.'
      );
    }

    return null;
  }

  const queryString = searchParams.toString(); // "https://devapi.popcon.store/popups/banners?limit=5"

  return queryString
    ? `${normalizedBaseUrl}/popups/banners?${queryString}`
    : `${normalizedBaseUrl}/popups/banners`;
}
// 백엔드 응답에 화면에 노출할 배너가 하나 이상 있는지 확인
function hasVisibleBannerItems(response: PopupSectionApiResponse) {
  return Array.isArray(response.data?.items) && response.data.items.length > 0;
}
// 실제 백엔드 배너 API로 요청을 전달하고, 노출 가능한 데이터가 있으면 그대로 반환
async function proxyBannerRequest(
  request: Request,
  searchParams: URLSearchParams
) {
  const proxyUrl = buildProxyUrl(searchParams);

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

    if (!response.ok || !hasVisibleBannerItems(responseBody)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[popups/banners] Backend banner response is empty or unavailable. Falling back to mock banner data.'
        );
      }

      return null;
    }

    return NextResponse.json(responseBody, { status: response.status });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[popups/banners] Failed to fetch backend banner data. Falling back to mock banner data.',
        error
      );
    }

    return null;
  }
}

// mock 배너 목록을 홈 배너 섹션 응답 형식으로 변환
function buildBannerSection(limit: number): PopupSectionResponse {
  const items = mockBannerItems
    .filter((item) => item.phase.status !== 'ENDED')
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit)
    .map((item) => {
      const { priority: _priority, ...bannerItem } = item;
      return bannerItem;
    });

  return {
    sectionKey: 'BANNERS',
    itemCount: items.length,
    items,
  };
}
// 배너 섹션 데이터를 성공 응답 형식으로 감쌈
function createBannerSectionResponse(section: PopupSectionResponse) {
  return NextResponse.json(
    {
      code: API_RESPONSE_CODE.STATUS.SUCCESS,
      message: '배너 섹션 조회를 성공했습니다.',
      data: section,
    },
    { status: 200 }
  );
}

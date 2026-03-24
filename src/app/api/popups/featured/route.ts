import {
  createInternalServerErrorResponse,
  createInvalidLimitResponse,
  createPopupSectionSuccessResponse,
  parseLimit,
  proxyPopupSectionRequest,
} from '@/app/api/popups/shared/route-helpers';
import { mockFeaturedItems } from '@/app/api/popups/featured/data/mock-featured-items';
import type { PopupSectionResponse } from '@/types/api/home';

const DEFAULT_LIMIT = 10;
const MIN_LIMIT = 1;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit({
      searchParams,
      defaultLimit: DEFAULT_LIMIT,
      minLimit: MIN_LIMIT,
    });

    if (limit === null) {
      return createInvalidLimitResponse({
        message: '요청 파라미터가 올바르지 않습니다.',
        limitMessage: 'limit는 1 이상이어야 합니다.',
      });
    }

    const proxiedResponse = await proxyPopupSectionRequest({
      request,
      searchParams,
      endpoint: '/popups/featured',
      missingBaseUrlMessage:
        '[popups/featured] NEXT_PUBLIC_API_BASE_URL가 설정되지 않았습니다. 목 주목할만한 팝업 데이터로 대체합니다.',
      unavailableResponseMessage:
        '[popups/featured] 응답이 비어 있거나 사용할 수 없습니다. 목 주목할만한 팝업 데이터로 대체합니다.',
      requestFailureMessage:
        '[popups/featured] 주목할만한 팝업 데이터를 가져오지 못했습니다. 목 데이터로 대체합니다.',
    });

    if (proxiedResponse) {
      return proxiedResponse;
    }

    return createPopupSectionSuccessResponse({
      message: '주목할만한 팝업 조회 성공',
      data: buildFeaturedSection(limit),
    });
  } catch (error) {
    console.error(error);

    return createInternalServerErrorResponse({
      message: '서버 내부 오류가 발생했습니다.',
    });
  }
}

function buildFeaturedSection(limit: number): PopupSectionResponse {
  const items = [...mockFeaturedItems]
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .slice(0, limit)
    .map((item) => {
      const { weightedScore: _weightedScore, ...featuredItem } = item;
      return featuredItem;
    });

  return {
    sectionKey: 'FEATURED',
    itemCount: items.length,
    items,
  };
}

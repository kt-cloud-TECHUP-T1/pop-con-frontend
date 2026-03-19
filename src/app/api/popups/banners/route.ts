import {
  createInternalServerErrorResponse,
  createInvalidLimitResponse,
  createPopupSectionSuccessResponse,
  parseLimit,
  proxyPopupSectionRequest,
} from '@/app/api/popups/shared/route-helpers';
import { mockBannerItems } from '@/app/api/popups/banners/data/mock-banner-items';
import type { PopupSectionResponse } from '@/types/api/home';

const DEFAULT_LIMIT = 5;
const MIN_LIMIT = 1;
const MAX_LIMIT = 5;

// 백엔드 배너 응답을 우선 사용하고, 실패하면 mock 데이터로 대체
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit({
      searchParams,
      defaultLimit: DEFAULT_LIMIT,
      minLimit: MIN_LIMIT,
      maxLimit: MAX_LIMIT,
    });

    if (limit === null) {
      return createInvalidLimitResponse({
        message: '입력값이 올바르지 않습니다.',
        limitMessage: 'limit는 1 이상 5 이하여야 합니다.',
      });
    }

    const proxiedResponse = await proxyPopupSectionRequest({
      request,
      searchParams,
      endpoint: '/popups/banners',
      missingBaseUrlMessage:
        '[popups/banners] NEXT_PUBLIC_API_BASE_URL가 설정되지 않았습니다. 목 배너 데이터로 대체합니다.',
      unavailableResponseMessage:
        '[popups/banners] 응답이 비어 있거나 사용할 수 없습니다. 목 배너 데이터로 대체합니다.',
      requestFailureMessage:
        '[popups/banners] 배너 데이터를 가져오지 못했습니다. 목 배너 데이터로 대체합니다.',
    });

    if (proxiedResponse) {
      return proxiedResponse;
    }

    // 백엔드 응답을 사용할 수 없으면 로컬 mock 데이터를 대신 내려줌
    return createPopupSectionSuccessResponse({
      message: '배너 섹션 조회를 성공했습니다.',
      data: buildBannerSection(limit),
    });
  } catch (error) {
    console.error(error);

    return createInternalServerErrorResponse({
      message: '시스템 오류가 발생했습니다.',
    });
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

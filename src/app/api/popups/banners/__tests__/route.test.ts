/**
 * @jest-environment node
 */
import { API_ERROR_CODES } from '@/constants/api';

// API_BASE_URL은 모듈 로드 시점에 process.env를 읽어 상수로 저장한다.
// beforeEach에서 env를 바꿔도 이미 캡처된 값은 변하지 않으므로,
// 매 테스트마다 jest.resetModules() + 동적 import로 모듈을 새로 불러온다.

function createRequest(params?: { limit?: string }) {
  const url = new URL('http://localhost/api/popups/banners');
  if (params?.limit !== undefined) {
    url.searchParams.set('limit', params.limit);
  }
  return new Request(url.toString());
}

function createMockBackendResponse(body: unknown, status = 200): Response {
  return {
    status,
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

const MOCK_BANNER_RESPONSE = {
  code: 'SUCCESS',
  message: '배너 섹션 조회를 성공했습니다.',
  data: {
    sectionKey: 'BANNERS',
    itemCount: 1,
    items: [
      {
        popupId: 101,
        title: 'T1 팝업 스토어',
        supportingText: 'T1 × POPUP SEOUL',
        subText: null,
        caption: '캡션 문구',
        thumbnailUrl: 'https://cdn.popcon.com/banners/101.jpg',
        liked: null,
        stats: null,
        overlay: null,
        phase: {
          type: 'DRAW',
          status: 'OPEN',
          openAt: '2026-03-01T10:00:00+09:00',
          closeAt: '2026-03-10T20:00:00+09:00',
        },
      },
    ],
  },
};

describe('GET /api/popups/banners', () => {
  let GET: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.com';
    ({ GET } = await import('../route'));
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  describe('limit 검증', () => {
    it('limit 파라미터가 없으면 기본값 5로 백엔드를 호출한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_BANNER_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });

    it.each([
      ['0', 'min 미만'],
      ['6', 'max 초과'],
      ['2.5', '소수'],
      ['abc', '문자열'],
      ['-1', '음수'],
    ])('limit=%s (%s)이면 400과 C001을 반환한다', async (limit) => {
      const response = await GET(createRequest({ limit }));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty('limit');
    });

    it.each([['1'], ['3'], ['5']])(
      'limit=%s (유효한 값)이면 백엔드를 호출한다',
      async (limit) => {
        const mockFetch = jest
          .fn()
          .mockResolvedValue(createMockBackendResponse(MOCK_BANNER_RESPONSE));
        global.fetch = mockFetch;

        await GET(createRequest({ limit }));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`limit=${limit}`),
          expect.any(Object)
        );
      }
    );
  });

  describe('백엔드 프록시', () => {
    it('백엔드가 200이면 응답을 그대로 통과한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_BANNER_RESPONSE, 200));

      const response = await GET(createRequest({ limit: '3' }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_BANNER_RESPONSE);
    });

    it('백엔드가 400이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'C001', message: '잘못된 요청', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 400));

      const response = await GET(createRequest({ limit: '3' }));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 500이면 내부 오류를 S001로 마스킹한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(
          createMockBackendResponse({ message: '백엔드 내부 오류' }, 500)
        );

      const response = await GET(createRequest({ limit: '3' }));
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });

    it('fetch 자체가 실패하면 500과 S001을 반환한다', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const response = await GET(createRequest({ limit: '3' }));
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });

  describe('NEXT_PUBLIC_API_BASE_URL 미설정', () => {
    it('API_BASE_URL이 없으면 500과 S001을 반환한다', async () => {
      jest.resetModules();
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      const { GET: GETWithNoUrl } = await import('../route');

      const response = await GETWithNoUrl(createRequest());
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });
});

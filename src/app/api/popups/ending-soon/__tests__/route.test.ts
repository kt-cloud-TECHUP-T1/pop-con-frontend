/**
 * @jest-environment node
 */

/**
 * GET /api/popups/ending-soon 테스트
 *
 * [시나리오 목록]
 *
 * ✅ limit 검증
 *   - limit 파라미터 없으면 기본값 10으로 백엔드를 호출한다
 *   - 유효하지 않은 limit이면 400과 C001을 반환한다
 *   - 유효한 limit이면 백엔드를 호출한다
 *
 * ✅ Authorization 헤더
 *   - 인증 없이 요청 → Authorization 헤더 없이 백엔드 호출
 *   - Authorization 헤더 포함 요청 → 백엔드에 그대로 전달
 *
 * ⚠️ 백엔드 오류
 *   - 백엔드가 200이면 응답을 그대로 통과한다
 *   - 백엔드가 400이면 응답을 그대로 통과한다
 *   - 백엔드가 500이면 S001로 마스킹한다
 *   - fetch 자체가 실패하면 500 + S001을 반환한다
 *
 * 🔲 환경변수
 *   - NEXT_PUBLIC_API_BASE_URL 미설정 → 즉시 500 + S001
 */
import { API_ERROR_CODES } from '@/constants/api';

function createRequest(options: { limit?: string; authorization?: string } = {}): Request {
  const url = new URL('http://localhost/api/popups/ending-soon');
  if (options.limit !== undefined) {
    url.searchParams.set('limit', options.limit);
  }
  return new Request(url.toString(), {
    headers: {
      ...(options.authorization ? { Authorization: options.authorization } : {}),
    },
  });
}

function createMockBackendResponse(body: unknown, status = 200): Response {
  return {
    status,
    headers: {
      getSetCookie: jest.fn().mockReturnValue([]),
    },
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

const MOCK_ENDING_SOON_RESPONSE = {
  code: 'SUCCESS',
  message: '곧 종료되는 팝업 조회 성공',
  data: {
    sectionKey: 'ENDING_SOON',
    itemCount: 2,
    items: [
      {
        popupId: 201,
        title: '마감 임박 팝업 A',
        supportingText: null,
        subText: '성수 XYZ',
        caption: null,
        thumbnailUrl: 'https://cdn.popcon.com/popups/201/thumb.jpg',
        liked: false,
        stats: { likeCount: 50, viewCount: 300 },
        overlay: null,
        phase: {
          type: 'DRAW',
          status: 'OPEN',
          openAt: '2026-03-01T10:00:00+09:00',
          closeAt: '2026-03-25T20:00:00+09:00',
        },
      },
      {
        popupId: 202,
        title: '마감 임박 팝업 B',
        supportingText: null,
        subText: '더현대 서울',
        caption: null,
        thumbnailUrl: 'https://cdn.popcon.com/popups/202/thumb.jpg',
        liked: true,
        stats: { likeCount: 30, viewCount: 200 },
        overlay: null,
        phase: {
          type: 'AUCTION',
          status: 'OPEN',
          openAt: '2026-03-02T10:00:00+09:00',
          closeAt: '2026-03-26T20:00:00+09:00',
        },
      },
    ],
  },
};

describe('GET /api/popups/ending-soon', () => {
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

  // ── limit 검증 ─────────────────────────────────────────────────────────────

  describe('limit 검증', () => {
    it('limit 파라미터가 없으면 기본값 10으로 백엔드를 호출한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_ENDING_SOON_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it.each([
      ['0', 'min 미만'],
      ['11', 'max 초과'],
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

    it.each([['1'], ['5'], ['10']])(
      'limit=%s (유효한 값)이면 백엔드를 호출한다',
      async (limit) => {
        const mockFetch = jest
          .fn()
          .mockResolvedValue(createMockBackendResponse(MOCK_ENDING_SOON_RESPONSE));
        global.fetch = mockFetch;

        await GET(createRequest({ limit }));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`limit=${limit}`),
          expect.any(Object)
        );
      }
    );
  });

  // ── Authorization 헤더 ─────────────────────────────────────────────────────

  describe('Authorization 헤더', () => {
    it('인증 없이 요청하면 Authorization 헤더 없이 백엔드를 호출한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_ENDING_SOON_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest());

      const callHeaders = mockFetch.mock.calls[0][1]?.headers ?? {};
      expect(callHeaders).not.toHaveProperty('Authorization');
    });

    it('Authorization 헤더가 있으면 백엔드에 그대로 전달한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_ENDING_SOON_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest({ authorization: 'Bearer user-access-token' }));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/popups/ending-soon'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer user-access-token',
          }),
        })
      );
    });
  });

  // ── 백엔드 프록시 ──────────────────────────────────────────────────────────

  describe('백엔드 프록시', () => {
    it('백엔드가 200이면 응답을 그대로 통과한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_ENDING_SOON_RESPONSE, 200));

      const response = await GET(createRequest());
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_ENDING_SOON_RESPONSE);
    });

    it('백엔드가 400이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'C001', message: '잘못된 요청', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 400));

      const response = await GET(createRequest());
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 500이면 S001로 마스킹한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse({ message: '내부 오류' }, 500));

      const response = await GET(createRequest());
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });

    it('fetch 자체가 실패하면 500과 S001을 반환한다', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const response = await GET(createRequest());
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });

  // ── 환경변수 ───────────────────────────────────────────────────────────────

  describe('NEXT_PUBLIC_API_BASE_URL 미설정', () => {
    it('API_BASE_URL이 없으면 즉시 500과 S001을 반환한다', async () => {
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

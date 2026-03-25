/**
 * @jest-environment node
 */

/**
 * GET /api/popups/rankings 테스트
 *
 * [시나리오 목록]
 *
 * ✅ 정상 플로우
 *   - 인증 없이 요청 → Authorization 헤더 없이 백엔드 호출
 *   - Authorization 헤더 포함 요청 → 백엔드에 그대로 전달
 *   - 백엔드 200 → 응답을 그대로 통과한다
 *
 * ⚠️ 백엔드 오류
 *   - 백엔드가 400이면 응답을 그대로 통과한다
 *   - 백엔드가 500이면 S001로 마스킹한다
 *   - fetch 자체가 실패하면 500 + S001을 반환한다
 *
 * 🔲 환경변수
 *   - NEXT_PUBLIC_API_BASE_URL 미설정 → 즉시 500 + S001
 */
import { API_ERROR_CODES } from '@/constants/api';

function createRequest(options: { authorization?: string } = {}): Request {
  return new Request('http://localhost/api/popups/rankings', {
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

const MOCK_RANKINGS_RESPONSE = {
  code: 'SUCCESS',
  message: '랭킹 섹션 조회를 성공했습니다.',
  data: {
    sectionKey: 'RANKINGS_WEEKLY',
    itemCount: 2,
    items: [
      {
        popupId: 1,
        title: '1위 팝업',
        overlay: { type: 'RANK', rank: 1 },
        stats: { likeCount: 100, viewCount: 1000 },
      },
      {
        popupId: 2,
        title: '2위 팝업',
        overlay: { type: 'RANK', rank: 2 },
        stats: { likeCount: 80, viewCount: 800 },
      },
    ],
  },
};

describe('GET /api/popups/rankings', () => {
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

  // ── 정상 플로우 ───────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('인증 없이 요청하면 Authorization 헤더 없이 백엔드를 호출한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_RANKINGS_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest());

      const callHeaders = mockFetch.mock.calls[0][1]?.headers ?? {};
      expect(callHeaders).not.toHaveProperty('Authorization');
    });

    it('Authorization 헤더가 있으면 백엔드에 그대로 전달한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_RANKINGS_RESPONSE));
      global.fetch = mockFetch;

      await GET(createRequest({ authorization: 'Bearer user-access-token' }));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/popups/rankings'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer user-access-token',
          }),
        })
      );
    });

    it('백엔드가 200이면 응답을 그대로 통과한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_RANKINGS_RESPONSE, 200));

      const response = await GET(createRequest());
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_RANKINGS_RESPONSE);
    });
  });

  // ── 백엔드 오류 ───────────────────────────────────────────────────────────

  describe('백엔드 오류', () => {
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

  // ── 환경변수 ──────────────────────────────────────────────────────────────

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

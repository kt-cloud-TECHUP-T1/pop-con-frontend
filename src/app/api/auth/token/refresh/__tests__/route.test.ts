/**
 * @jest-environment node
 */

/**
 * POST /api/auth/token/refresh 테스트
 *
 * [시나리오 목록]
 *
 * ❌ 검증 실패
 *   - refresh_token 쿠키 없음 → 400 + C001
 *
 * ✅ 정상 플로우
 *   - refresh_token 쿠키 있음 → 백엔드 호출 + 응답 통과
 *   - refresh_token 값이 백엔드 요청 본문에 포함된다
 *   - Set-Cookie 헤더가 응답에 전달된다
 *
 * ⚠️ 백엔드 오류
 *   - 백엔드가 400이면 응답을 그대로 통과한다
 *   - 백엔드가 401이면 응답을 그대로 통과한다
 *   - 백엔드가 500이면 S001로 마스킹한다
 *   - fetch 자체가 실패하면 500 + S001을 반환한다
 *
 * 🔲 환경변수
 *   - NEXT_PUBLIC_API_BASE_URL 미설정 → fetch 실패로 500 + S001
 */

import { NextRequest } from 'next/server';
import { API_ERROR_CODES } from '@/constants/api';

function createRequest(options: { cookies?: Record<string, string> } = {}): NextRequest {
  const cookieEntries = Object.entries(options.cookies ?? {});
  const cookieStr = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

  return new NextRequest('http://localhost/api/auth/token/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieStr ? { Cookie: cookieStr } : {}),
    },
  });
}

function createMockBackendResponse(
  body: unknown,
  status = 200,
  setCookies: string[] = []
): Response {
  return {
    status,
    headers: {
      getSetCookie: jest.fn().mockReturnValue(setCookies),
    },
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

const MOCK_REFRESH_RESPONSE = {
  code: 'SUCCESS',
  message: '토큰이 재발급되었습니다.',
  data: {
    accessToken: 'new-access-token-abc',
  },
};

describe('POST /api/auth/token/refresh', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.com';
    ({ POST } = await import('../route'));
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  // ── 검증 실패 ─────────────────────────────────────────────────────────────

  describe('검증 실패', () => {
    it('refresh_token 쿠키가 없으면 400과 C001을 반환한다', async () => {
      const response = await POST(createRequest());
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty('refreshToken');
    });
  });

  // ── 정상 플로우 ───────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('refresh_token 쿠키 있음 → 백엔드 호출 후 응답을 통과한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_REFRESH_RESPONSE, 200));
      global.fetch = mockFetch;

      const response = await POST(createRequest({ cookies: { refresh_token: 'my-refresh-token' } }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_REFRESH_RESPONSE);
    });

    it('refresh_token 값이 백엔드 요청 본문에 포함된다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_REFRESH_RESPONSE, 200));
      global.fetch = mockFetch;

      await POST(createRequest({ cookies: { refresh_token: 'rt-secret-123' } }));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/token/refresh'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"refreshToken":"rt-secret-123"'),
        })
      );
    });

    it('백엔드 응답의 Set-Cookie 헤더를 클라이언트에 전달한다', async () => {
      const mockFetch = jest.fn().mockResolvedValue(
        createMockBackendResponse(MOCK_REFRESH_RESPONSE, 200, [
          'refresh_token=new-rt; Path=/; HttpOnly',
          'access_token=new-at; Path=/',
        ])
      );
      global.fetch = mockFetch;

      const response = await POST(createRequest({ cookies: { refresh_token: 'old-rt' } }));

      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('refresh_token=new-rt');
    });
  });

  // ── 백엔드 오류 ───────────────────────────────────────────────────────────

  describe('백엔드 오류', () => {
    it('백엔드가 400이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'C001', message: '잘못된 요청', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 400));

      const response = await POST(createRequest({ cookies: { refresh_token: 'rt' } }));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 401이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'A003', message: '재로그인이 필요합니다.', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 401));

      const response = await POST(createRequest({ cookies: { refresh_token: 'expired-rt' } }));
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 500이면 S001로 마스킹한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse({ message: '내부 오류' }, 500));

      const response = await POST(createRequest({ cookies: { refresh_token: 'rt' } }));
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });

    it('fetch 자체가 실패하면 500과 S001을 반환한다', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const response = await POST(createRequest({ cookies: { refresh_token: 'rt' } }));
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });

  // ── 환경변수 ──────────────────────────────────────────────────────────────

  describe('NEXT_PUBLIC_API_BASE_URL 미설정', () => {
    it('API_BASE_URL이 없으면 fetch 실패로 500과 S001을 반환한다', async () => {
      jest.resetModules();
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      const { POST: POSTWithNoUrl } = await import('../route');

      const response = await POSTWithNoUrl(
        createRequest({ cookies: { refresh_token: 'rt' } })
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });
});

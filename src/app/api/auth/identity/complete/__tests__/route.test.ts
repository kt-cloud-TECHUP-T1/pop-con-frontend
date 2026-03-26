/**
 * @jest-environment node
 */

/**
 * POST /api/auth/identity/complete 테스트
 *
 * [시나리오 목록]
 *
 * ❌ 입력값 검증 실패
 *   - 요청 본문이 JSON이 아님 → 400 + C001
 *   - identityVerificationId 누락 → 400 + C001
 *   - identityVerificationId 공백 문자열 → 400 + C001
 *
 * ❌ 세션 검증 실패
 *   - register_token 쿠키 없음 → 401 + A001
 *
 * ✅ 정상 플로우
 *   - 유효한 identityVerificationId + register_token → 백엔드 호출 + 응답 통과
 *   - 앞뒤 공백을 trim하여 백엔드에 전달한다
 *   - Cookie 헤더를 백엔드에 그대로 전달한다
 *   - Set-Cookie 헤더가 응답에 전달된다
 *
 * ⚠️ 백엔드 오류
 *   - 백엔드가 400이면 응답을 그대로 통과한다
 *   - 백엔드가 500이면 S001로 마스킹한다
 *   - fetch 자체가 실패하면 500 + S001을 반환한다
 *
 * 🔲 환경변수
 *   - NEXT_PUBLIC_API_BASE_URL 미설정 → fetch 실패로 500 + S001
 */
import { NextRequest } from 'next/server';
import { API_ERROR_CODES } from '@/constants/api';
import { AUTH_ERROR_CODES } from '@/constants/auth';

function createRequest(options: {
  body?: unknown;
  invalidJson?: boolean;
  cookies?: Record<string, string>;
}): NextRequest {
  const cookieEntries = Object.entries(options.cookies ?? {});
  const cookieStr = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

  return new NextRequest('http://localhost/api/auth/identity/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieStr ? { Cookie: cookieStr } : {}),
    },
    body: options.invalidJson ? 'invalid-json{{{' : JSON.stringify(options.body),
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

const VALID_COOKIES = { register_token: 'valid-register-token' };

const MOCK_IDENTITY_RESPONSE = {
  code: 'SUCCESS',
  message: '본인인증이 완료되었습니다.',
  data: {
    isNewUser: true,
    nextStep: 'TERMS',
  },
};

describe('POST /api/auth/identity/complete', () => {
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

  // ── 입력값 검증 실패 ──────────────────────────────────────────────────────

  describe('입력값 검증 실패', () => {
    it('요청 본문이 유효한 JSON이 아니면 400과 C001을 반환한다', async () => {
      const response = await POST(createRequest({ invalidJson: true, cookies: VALID_COOKIES }));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty('identityVerificationId');
    });

    it('identityVerificationId가 누락되면 400과 C001을 반환한다', async () => {
      const response = await POST(createRequest({ body: {}, cookies: VALID_COOKIES }));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty('identityVerificationId');
    });

    it('identityVerificationId가 공백 문자열이면 400과 C001을 반환한다', async () => {
      const response = await POST(
        createRequest({ body: { identityVerificationId: '   ' }, cookies: VALID_COOKIES })
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty('identityVerificationId');
    });
  });

  // ── 세션 검증 실패 ────────────────────────────────────────────────────────

  describe('세션 검증 실패', () => {
    it('register_token 쿠키가 없으면 401과 A001을 반환한다', async () => {
      const response = await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' } })
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.code).toBe(AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED);
    });
  });

  // ── 정상 플로우 ───────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('유효한 identityVerificationId로 백엔드를 호출하고 응답을 통과한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_IDENTITY_RESPONSE, 200));
      global.fetch = mockFetch;

      const response = await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_IDENTITY_RESPONSE);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/identity/complete'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"identityVerificationId":"valid-id-123"'),
        })
      );
    });

    it('앞뒤 공백을 trim하여 백엔드에 전달한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_IDENTITY_RESPONSE, 200));
      global.fetch = mockFetch;

      await POST(
        createRequest({
          body: { identityVerificationId: '  trimmed-id  ' },
          cookies: VALID_COOKIES,
        })
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"identityVerificationId":"trimmed-id"'),
        })
      );
    });

    it('Cookie 헤더를 백엔드에 그대로 전달한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_IDENTITY_RESPONSE, 200));
      global.fetch = mockFetch;

      await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Cookie: expect.stringContaining('register_token=valid-register-token'),
          }),
        })
      );
    });

    it('백엔드 응답의 Set-Cookie 헤더를 클라이언트에 전달한다', async () => {
      const mockFetch = jest.fn().mockResolvedValue(
        createMockBackendResponse(MOCK_IDENTITY_RESPONSE, 200, [
          'register_token=token-xyz; Path=/; HttpOnly',
        ])
      );
      global.fetch = mockFetch;

      const response = await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );

      expect(response.headers.get('Set-Cookie')).toContain('register_token=token-xyz');
    });
  });

  // ── 백엔드 오류 ───────────────────────────────────────────────────────────

  describe('백엔드 오류', () => {
    it('백엔드가 400이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'A002', message: '인증 정보가 유효하지 않습니다.', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 400));

      const response = await POST(
        createRequest({ body: { identityVerificationId: 'invalid-id' }, cookies: VALID_COOKIES })
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 500이면 S001로 마스킹한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse({ message: '내부 오류' }, 500));

      const response = await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });

    it('fetch 자체가 실패하면 500과 S001을 반환한다', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const response = await POST(
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );
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
        createRequest({ body: { identityVerificationId: 'valid-id-123' }, cookies: VALID_COOKIES })
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });
});

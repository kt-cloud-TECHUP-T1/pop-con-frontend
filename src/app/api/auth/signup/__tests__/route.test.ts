/**
 * @jest-environment node
 */

/**
 * POST /api/auth/signup 테스트
 *
 * [시나리오 목록]
 *
 * ❌ 입력값 검증 실패
 *   - 요청 본문이 유효하지 않음(null/비객체) → 400 + C001
 *   - agreements 필드 자체 누락 → 400 + C001 (3개 필드 오류)
 *   - isPrivacyPolicyAgreed false → 400 + C001
 *   - isIdentifierPolicyAgreed false → 400 + C001
 *   - isServicePolicyAgreed false → 400 + C001
 *
 * ❌ 세션 검증 실패
 *   - register_token 쿠키 없음 → 401 + A001
 *
 * ✅ 정상 플로우
 *   - 필수 약관 3개 동의 + register_token 있음 → 백엔드 호출 + 응답 통과
 *   - isMarketingAgreed: true 포함 시 백엔드에 그대로 전달
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

type SignupAgreements = {
  isPrivacyPolicyAgreed?: boolean;
  isIdentifierPolicyAgreed?: boolean;
  isServicePolicyAgreed?: boolean;
  isMarketingAgreed?: boolean;
};

function createRequest(options: {
  body?: unknown;
  cookies?: Record<string, string>;
}): NextRequest {
  const cookieEntries = Object.entries(options.cookies ?? {});
  const cookieStr = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

  return new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieStr ? { Cookie: cookieStr } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

function createValidRequest(
  agreements: SignupAgreements = {},
  registerToken = 'valid-register-token'
): NextRequest {
  return createRequest({
    body: {
      agreements: {
        isPrivacyPolicyAgreed: true,
        isIdentifierPolicyAgreed: true,
        isServicePolicyAgreed: true,
        ...agreements,
      },
    },
    cookies: { register_token: registerToken },
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

const MOCK_SIGNUP_RESPONSE = {
  code: 'SUCCESS',
  message: '회원가입이 완료되었습니다.',
  data: {
    accessToken: 'access-token-xyz',
    userId: 42,
  },
};

describe('POST /api/auth/signup', () => {
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
    it('요청 본문이 null이면 400과 C001을 반환한다', async () => {
      const response = await POST(
        createRequest({ body: null, cookies: { register_token: 'token' } })
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
    });

    it('agreements 필드가 없으면 400과 C001을 반환하며 3개 필드 오류가 포함된다', async () => {
      const response = await POST(
        createRequest({ body: {}, cookies: { register_token: 'token' } })
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
      expect(body.data).toHaveProperty(['agreements.isPrivacyPolicyAgreed']);
      expect(body.data).toHaveProperty(['agreements.isIdentifierPolicyAgreed']);
      expect(body.data).toHaveProperty(['agreements.isServicePolicyAgreed']);
    });

    it.each([
      ['isPrivacyPolicyAgreed', { isPrivacyPolicyAgreed: false }],
      ['isIdentifierPolicyAgreed', { isIdentifierPolicyAgreed: false }],
      ['isServicePolicyAgreed', { isServicePolicyAgreed: false }],
    ] as [string, SignupAgreements][])(
      '%s가 false이면 400과 C001을 반환한다',
      async (fieldName, overrides) => {
        const response = await POST(
          createRequest({
            body: {
              agreements: {
                isPrivacyPolicyAgreed: true,
                isIdentifierPolicyAgreed: true,
                isServicePolicyAgreed: true,
                ...overrides,
              },
            },
            cookies: { register_token: 'token' },
          })
        );
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.code).toBe(API_ERROR_CODES.COMMON.BAD_REQUEST);
        expect(body.data).toHaveProperty([`agreements.${fieldName}`]);
      }
    );
  });

  // ── 세션 검증 실패 ────────────────────────────────────────────────────────

  describe('세션 검증 실패', () => {
    it('register_token 쿠키가 없으면 401과 A001을 반환한다', async () => {
      const response = await POST(
        createRequest({
          body: {
            agreements: {
              isPrivacyPolicyAgreed: true,
              isIdentifierPolicyAgreed: true,
              isServicePolicyAgreed: true,
            },
          },
        })
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.code).toBe(AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED);
    });
  });

  // ── 정상 플로우 ───────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('필수 약관 3개 동의 + register_token → 백엔드 호출 후 응답을 통과한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_SIGNUP_RESPONSE, 200));
      global.fetch = mockFetch;

      const response = await POST(createValidRequest());
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(MOCK_SIGNUP_RESPONSE);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"registerToken":"valid-register-token"'),
        })
      );
    });

    it('isMarketingAgreed: true 포함 시 백엔드에 그대로 전달된다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_SIGNUP_RESPONSE, 200));
      global.fetch = mockFetch;

      await POST(createValidRequest({ isMarketingAgreed: true }));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"isMarketingAgreed":true'),
        })
      );
    });

    it('isMarketingAgreed 없이 요청하면 마케팅 동의 없이 백엔드를 호출한다', async () => {
      const mockFetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(MOCK_SIGNUP_RESPONSE, 200));
      global.fetch = mockFetch;

      await POST(createValidRequest());

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.agreements.isMarketingAgreed).toBeUndefined();
    });

    it('백엔드 응답의 Set-Cookie 헤더를 클라이언트에 전달한다', async () => {
      const mockFetch = jest.fn().mockResolvedValue(
        createMockBackendResponse(MOCK_SIGNUP_RESPONSE, 200, [
          'refresh_token=rt-xyz; Path=/; HttpOnly',
        ])
      );
      global.fetch = mockFetch;

      const response = await POST(createValidRequest());

      expect(response.headers.get('Set-Cookie')).toContain('refresh_token=rt-xyz');
    });
  });

  // ── 백엔드 오류 ───────────────────────────────────────────────────────────

  describe('백엔드 오류', () => {
    it('백엔드가 400이면 응답을 그대로 통과한다', async () => {
      const errorBody = { code: 'J002', message: '이미 가입된 회원입니다.', data: null };
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse(errorBody, 400));

      const response = await POST(createValidRequest());
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual(errorBody);
    });

    it('백엔드가 500이면 S001로 마스킹한다', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValue(createMockBackendResponse({ message: '내부 오류' }, 500));

      const response = await POST(createValidRequest());
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });

    it('fetch 자체가 실패하면 500과 S001을 반환한다', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const response = await POST(createValidRequest());
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

      const response = await POSTWithNoUrl(createValidRequest());
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.code).toBe(API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR);
    });
  });
});

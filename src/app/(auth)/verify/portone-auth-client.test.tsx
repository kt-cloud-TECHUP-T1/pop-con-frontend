/**
 * PortoneAuthClient 테스트
 *
 * [시나리오 목록]
 *
 * ✅ 정상 플로우
 *   - 신규 회원: 본인인증 완료 → nextStep=TERMS → /signup 이동
 *   - 기존 회원: 본인인증 완료 → accessToken 저장 → / 이동
 *
 * ❌ 중단 / 취소 플로우
 *   - 포트원 팝업을 그냥 닫음 (response === undefined) → 아무 동작 없음
 *   - 포트원이 code를 반환 (사용자 취소 등) → 취소 스낵바
 *   - identityVerificationId 누락 → 결과 확인 불가 스낵바
 *
 * ⚠️ API 에러 플로우
 *   - C001 입력값 오류 → 스낵바
 *   - A001 세션 만료 → 스낵바
 *   - A002 인증 정보 유효하지 않음 → 스낵바
 *   - I001 포트원 조회 실패 → 스낵바
 *   - I002 포트원 검증 실패 → 스낵바
 *   - E001 암호화 실패 → 스낵바
 *   - J001 만 14세 미만 → 모달 표시
 *   - S001 서버 오류 → 스낵바 (동적 메시지 포함)
 *
 * 🔲 미확인 (실제 포트원 연동 필요)
 *   - 포트원 설정값 누락 환경에서의 동작
 *   - GrpcErrorCode.Cancelled 예외 발생 시 동작
 *
 * 🧩 모달 동작
 *   - X 버튼(onClose) 클릭 → 모달 닫힘, 현재 페이지 유지
 *   - '메인으로 돌아가기' 버튼 클릭 → 모달 닫힘 + / 이동
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PortoneAuthClient from './portone-auth-client';
import { AUTH_ERROR_CODES } from '@/constants/auth';
import { API_ERROR_CODES } from '@/constants/api';

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSnackbarDestructive = jest.fn();
const mockSnackbarInformative = jest.fn();
jest.mock('@/components/ui/snackbar', () => ({
  snackbar: {
    destructive: (...args: unknown[]) => mockSnackbarDestructive(...args),
    informative: (...args: unknown[]) => mockSnackbarInformative(...args),
  },
}));

const mockSetAccessToken = jest.fn();
jest.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: (selector: (state: { setAccessToken: jest.Mock }) => unknown) =>
    selector({ setAccessToken: mockSetAccessToken }),
}));

const mockRequestIdentityVerification = jest.fn();
jest.mock('@portone/browser-sdk/v2', () => ({
  __esModule: true,
  default: {
    requestIdentityVerification: (...args: unknown[]) =>
      mockRequestIdentityVerification(...args),
  },
  GrpcErrorCode: { Cancelled: 'CANCELLED' },
  isIdentityVerificationError: () => false,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** 인증하기 버튼 클릭 */
function clickVerify() {
  fireEvent.click(screen.getByRole('button', { name: '인증하기' }));
}

/** fetch 응답 mock */
function mockFetchResponse(body: object, ok = true, status = 200) {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

/** 포트원 팝업 성공 응답 mock */
function mockPortoneSuccess(identityVerificationId = 'test-id') {
  mockRequestIdentityVerification.mockResolvedValueOnce({
    identityVerificationId,
  });
}

// ─── Setup ───────────────────────────────────────────────────────────────────

// NEXT_PUBLIC_* 환경변수는 모듈 최상위에서 평가되므로 .env.test에서 주입
beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PortoneAuthClient', () => {
  it('인증하기 버튼이 렌더링된다', () => {
    render(<PortoneAuthClient />);
    expect(screen.getByRole('button', { name: '인증하기' })).toBeInTheDocument();
  });

  // ── 정상 플로우 ──────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('신규 회원: nextStep=TERMS → /signup 이동', async () => {
      mockPortoneSuccess();
      mockFetchResponse({
        data: { isNewUser: true, nextStep: 'TERMS' },
      });

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signup');
      });
    });

    it('기존 회원: accessToken 저장 후 / 이동', async () => {
      mockPortoneSuccess();
      mockFetchResponse({
        data: { isNewUser: false, userId: 1, accessToken: 'token-abc' },
      });

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSetAccessToken).toHaveBeenCalledWith('token-abc');
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });

  // ── 중단 / 취소 플로우 ───────────────────────────────────────────────────

  describe('중단 / 취소 플로우', () => {
    it('포트원 팝업을 닫으면 (response undefined) 아무 동작 없음', async () => {
      mockRequestIdentityVerification.mockResolvedValueOnce(undefined);

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSnackbarDestructive).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('포트원이 code를 반환하면 취소 스낵바 표시', async () => {
      mockRequestIdentityVerification.mockResolvedValueOnce({
        code: 'SOME_CODE',
        message: '사용자가 취소했습니다.',
      });

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSnackbarInformative).toHaveBeenCalledWith(
          expect.objectContaining({ title: '본인인증이 취소되었습니다.' })
        );
      });
    });

    it('identityVerificationId가 없으면 결과 확인 불가 스낵바 표시', async () => {
      mockRequestIdentityVerification.mockResolvedValueOnce({
        identityVerificationId: null,
      });

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({ title: '본인인증 결과를 확인할 수 없습니다.' })
        );
      });
    });
  });

  // ── API 에러 플로우 ───────────────────────────────────────────────────────

  describe('API 에러 플로우', () => {
    const errorCases: Array<{
      label: string;
      code: string;
      expectedTitle: string;
    }> = [
      {
        label: 'C001 입력값 오류',
        code: API_ERROR_CODES.COMMON.BAD_REQUEST,
        expectedTitle: '입력값이 올바르지 않습니다.',
      },
      {
        label: 'A001 세션 만료',
        code: AUTH_ERROR_CODES.AUTH.SESSION_EXPIRED,
        expectedTitle: '회원가입 세션이 만료되었습니다.',
      },
      {
        label: 'A002 인증 정보 유효하지 않음',
        code: AUTH_ERROR_CODES.AUTH.INVALID_AUTH,
        expectedTitle: '인증 정보가 유효하지 않습니다.',
      },
      {
        label: 'I001 포트원 조회 실패',
        code: AUTH_ERROR_CODES.PORTONE.FETCH_FAILED,
        expectedTitle: '본인인증 정보 조회에 실패했습니다.',
      },
      {
        label: 'I002 포트원 검증 실패',
        code: AUTH_ERROR_CODES.PORTONE.VERIFY_FAILED,
        expectedTitle: '본인인증 검증에 실패했습니다.',
      },
      {
        label: 'E001 암호화 실패',
        code: AUTH_ERROR_CODES.PORTONE.ENCRYPT_FAILED,
        expectedTitle: '데이터 암호화에 실패했습니다.',
      },
    ];

    test.each(errorCases)('$label → 스낵바 표시', async ({ code, expectedTitle }) => {
      mockPortoneSuccess();
      mockFetchResponse({ code, message: '' }, false, 400);

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({ title: expectedTitle })
        );
      });
    });

    it('J001 만 14세 미만 → 모달 표시', async () => {
      mockPortoneSuccess();
      mockFetchResponse(
        { code: AUTH_ERROR_CODES.JOIN.UNDERAGE },
        false,
        400
      );

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(screen.getByText('만 14세 이하 가입 제한')).toBeInTheDocument();
      });
    });

    it('S001 서버 오류 → 동적 메시지 포함 스낵바 표시', async () => {
      mockPortoneSuccess();
      mockFetchResponse(
        { code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR, message: '서버가 응답하지 않습니다.' },
        false,
        500
      );

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({
            title: '본인인증에 실패했습니다.',
            description: '서버가 응답하지 않습니다.',
          })
        );
      });
    });
  });

  // ── 모달 동작 ─────────────────────────────────────────────────────────────

  describe('만 14세 미만 모달', () => {
    async function renderWithUnder14Modal() {
      mockPortoneSuccess();
      mockFetchResponse(
        { code: AUTH_ERROR_CODES.JOIN.UNDERAGE },
        false,
        400
      );

      render(<PortoneAuthClient />);
      clickVerify();

      await waitFor(() => {
        expect(screen.getByText('만 14세 이하 가입 제한')).toBeInTheDocument();
      });
    }

    it('메인으로 돌아가기 버튼 클릭 → / 이동', async () => {
      await renderWithUnder14Modal();

      fireEvent.click(screen.getByRole('button', { name: '메인으로 돌아가기' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });
});

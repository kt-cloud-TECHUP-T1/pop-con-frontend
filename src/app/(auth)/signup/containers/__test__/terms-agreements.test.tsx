/**
 * TermsAgreements 테스트
 *
 * [시나리오 목록]
 *
 * ✅ 정상 플로우
 *   - 필수 약관 3개 동의 → accessToken 저장 → 성공 스낵바 → 2초 후 / 이동
 *   - 전체 약관 동의 → isMarketingAgreed: true로 API 호출
 *
 * ❌ 검증 실패 플로우
 *   - 초기 상태에서 회원가입 버튼 비활성화
 *   - 필수 약관 미동의 시 회원가입 버튼 비활성화
 *
 * ⚠️ API 에러 플로우
 *   - C001 입력값 오류 → 스낵바 (동적 메시지 포함)
 *   - A001 세션 만료 → 스낵바
 *   - A002 인증 정보 유효하지 않음 → 스낵바
 *   - J002 이미 가입된 회원 → 스낵바
 *   - U002 소셜 정보 누락 → 스낵바
 *   - S001 서버 오류 → 스낵바 (동적 메시지 포함)
 *   - 네트워크 오류 → catch 스낵바
 *
 * 🧩 UI 인터랙션
 *   - 전체 동의 체크 → 모든 약관 체크됨 + 회원가입 버튼 활성화
 *   - 전체 동의 후 재클릭 → 모든 약관 해제됨
 *   - 전체 동의 후 개별 약관 해제 → 전체 동의 체크박스도 해제됨
 *
 * 🔲 미확인
 *   - register_token 쿠키 누락 시 동작 (Next.js Route Handler 내부에서 cookies() 호출)
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import TermsAgreements from '../terms-agreements';
import { AUTH_ERROR_CODES } from '@/constants/auth';
import { API_ERROR_CODES } from '@/constants/api';

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSnackbarDestructive = jest.fn();
const mockSnackbarSuccess = jest.fn();
jest.mock('@/components/ui/snackbar', () => ({
  snackbar: {
    destructive: (...args: unknown[]) => mockSnackbarDestructive(...args),
    success: (...args: unknown[]) => mockSnackbarSuccess(...args),
  },
}));

const mockSetAccessToken = jest.fn();
jest.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: (selector: (state: { setAccessToken: jest.Mock }) => unknown) =>
    selector({ setAccessToken: mockSetAccessToken }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** 필수 약관 3개 모두 체크 */
function agreeRequiredTerms() {
  fireEvent.click(screen.getByText('(필수) 개인정보 수집 및 이용 동의'));
  fireEvent.click(screen.getByText('(필수) 고유식별정보 처리 동의'));
  fireEvent.click(screen.getByText('(필수) Pop-con 서비스 이용약관 동의'));
}

/** 회원가입 버튼 클릭 */
function clickSignup() {
  fireEvent.click(screen.getByRole('button', { name: '회원가입' }));
}

/** fetch 응답 mock */
function mockFetchResponse(body: object, ok = true, status = 200) {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('TermsAgreements', () => {
  it('약관 체크박스와 회원가입 버튼이 렌더링된다', () => {
    render(<TermsAgreements />);

    expect(screen.getByText('약관 전체 동의')).toBeInTheDocument();
    expect(
      screen.getByText('(필수) 개인정보 수집 및 이용 동의')
    ).toBeInTheDocument();
    expect(
      screen.getByText('(필수) 고유식별정보 처리 동의')
    ).toBeInTheDocument();
    expect(
      screen.getByText('(필수) Pop-con 서비스 이용약관 동의')
    ).toBeInTheDocument();
    expect(screen.getByText('(선택) 마케팅 수신 동의')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '회원가입' })
    ).toBeInTheDocument();
  });

  // ── 검증 실패 플로우 ─────────────────────────────────────────────────────

  describe('검증 실패 플로우', () => {
    it('초기 상태에서 회원가입 버튼이 비활성화된다', () => {
      render(<TermsAgreements />);

      expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled();
    });

    it.each([
      '(필수) 개인정보 수집 및 이용 동의',
      '(필수) 고유식별정보 처리 동의',
      '(필수) Pop-con 서비스 이용약관 동의',
    ])('필수 약관 "%s" 미동의 시 버튼 비활성화', (missingTerm) => {
      render(<TermsAgreements />);

      const otherRequiredTerms = [
        '(필수) 개인정보 수집 및 이용 동의',
        '(필수) 고유식별정보 처리 동의',
        '(필수) Pop-con 서비스 이용약관 동의',
      ].filter((term) => term !== missingTerm);

      otherRequiredTerms.forEach((term) =>
        fireEvent.click(screen.getByText(term))
      );

      expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled();
    });
  });

  // ── 정상 플로우 ──────────────────────────────────────────────────────────

  describe('정상 플로우', () => {
    it('필수 약관 3개 동의 → accessToken 저장 → 성공 스낵바 → 2초 후 / 이동', async () => {
      jest.useFakeTimers();

      mockFetchResponse({ data: { accessToken: 'token-abc', userId: 1 } });

      render(<TermsAgreements />);
      agreeRequiredTerms();
      clickSignup();

      await waitFor(() => {
        expect(mockSetAccessToken).toHaveBeenCalledWith('token-abc');
        expect(mockSnackbarSuccess).toHaveBeenCalledWith(
          expect.objectContaining({ title: '회원가입이 완료되었습니다.' })
        );
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockPush).toHaveBeenCalledWith('/');

      jest.useRealTimers();
    });

    it('전체 약관 동의 시 isMarketingAgreed: true로 API 호출', async () => {
      mockFetchResponse({ data: { accessToken: 'token-abc', userId: 1 } });

      render(<TermsAgreements />);
      fireEvent.click(screen.getByText('약관 전체 동의'));
      clickSignup();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/signup',
          expect.objectContaining({
            body: expect.stringContaining('"isMarketingAgreed":true'),
          })
        );
      });
    });
  });

  // ── UI 인터랙션 ──────────────────────────────────────────────────────────

  describe('UI 인터랙션', () => {
    it('전체 동의 체크 → 모든 약관 체크됨 + 회원가입 버튼 활성화', () => {
      render(<TermsAgreements />);

      fireEvent.click(screen.getByText('약관 전체 동의'));

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('data-state', 'checked');
      });
      expect(
        screen.getByRole('button', { name: '회원가입' })
      ).not.toBeDisabled();
    });

    it('전체 동의 후 재클릭 → 모든 약관 해제됨', () => {
      render(<TermsAgreements />);

      fireEvent.click(screen.getByText('약관 전체 동의'));
      fireEvent.click(screen.getByText('약관 전체 동의'));

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('data-state', 'unchecked');
      });
    });

    it('전체 동의 후 개별 약관 해제 → 전체 동의 체크박스도 해제됨', () => {
      render(<TermsAgreements />);

      fireEvent.click(screen.getByText('약관 전체 동의'));
      fireEvent.click(screen.getByText('(필수) 개인정보 수집 및 이용 동의'));

      // AllAgreeCheckbox는 첫 번째 체크박스
      const allAgreeCheckbox = screen.getAllByRole('checkbox')[0];
      expect(allAgreeCheckbox).toHaveAttribute('data-state', 'unchecked');
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
        label: 'J002 이미 가입된 회원',
        code: AUTH_ERROR_CODES.JOIN.ALREADY_COMPLETED,
        expectedTitle: '입력값이 올바르지 않습니다.',
      },
      {
        label: 'U002 소셜 정보 누락',
        code: AUTH_ERROR_CODES.USER.MISSING_SOCIAL_INFO,
        expectedTitle: '가입 세션의 소셜 정보가 누락되었습니다.',
      },
    ];

    test.each(errorCases)(
      '$label → 스낵바 표시',
      async ({ code, expectedTitle }) => {
        mockFetchResponse({ code, message: '' }, false, 400);

        render(<TermsAgreements />);
        agreeRequiredTerms();
        clickSignup();

        await waitFor(() => {
          expect(mockSnackbarDestructive).toHaveBeenCalledWith(
            expect.objectContaining({ title: expectedTitle })
          );
        });
      }
    );

    it('C001 입력값 오류 → 동적 메시지 포함 스낵바 표시', async () => {
      mockFetchResponse(
        {
          code: API_ERROR_CODES.COMMON.BAD_REQUEST,
          message: '필수 항목이 누락되었습니다.',
        },
        false,
        400
      );

      render(<TermsAgreements />);
      agreeRequiredTerms();
      clickSignup();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({
            title: '입력값이 올바르지 않습니다.',
            description: '필수 항목이 누락되었습니다.',
          })
        );
      });
    });

    it('S001 서버 오류 → 동적 메시지 포함 스낵바 표시', async () => {
      mockFetchResponse(
        {
          code: API_ERROR_CODES.SYSTEM.INTERNAL_SERVER_ERROR,
          message: '서버가 응답하지 않습니다.',
        },
        false,
        500
      );

      render(<TermsAgreements />);
      agreeRequiredTerms();
      clickSignup();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({
            title: '회원가입에 실패했습니다.',
            description: '서버가 응답하지 않습니다.',
          })
        );
      });
    });

    it('네트워크 오류 → catch 스낵바 표시', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network Error'));

      render(<TermsAgreements />);
      agreeRequiredTerms();
      clickSignup();

      await waitFor(() => {
        expect(mockSnackbarDestructive).toHaveBeenCalledWith(
          expect.objectContaining({ title: '회원가입 중 문제가 발생했습니다.' })
        );
      });
    });
  });
});

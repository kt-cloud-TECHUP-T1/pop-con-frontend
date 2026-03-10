export type DrawResult = 'won' | 'notWon';

type ConfirmDrawResultParams = {
  drawHistoryId: number;
  mockResult: DrawResult;
};

type ConfirmDrawResultSuccess = {
  status: 'success';
  result: DrawResult;
};

type ConfirmDrawResultFailed = {
  status: 'failed';
  message: string;
};

export type ConfirmDrawResultResponse =
  | ConfirmDrawResultSuccess
  | ConfirmDrawResultFailed;

const DRAW_RESULT_ENDPOINT = '/api/mypage/activity/draws/result';
const RESULT_CHECK_DELAY_MS = 1200;
const USE_MOCK_DRAW_RESULT_API = true;

function isDrawResult(value: unknown): value is DrawResult {
  return value === 'won' || value === 'notWon';
}

async function mockConfirmDrawResult(
  mockResult: DrawResult
): Promise<ConfirmDrawResultResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, RESULT_CHECK_DELAY_MS));

  return {
    status: 'success',
    result: mockResult,
  };
}

export async function confirmDrawResult({
  drawHistoryId,
  mockResult,
}: ConfirmDrawResultParams): Promise<ConfirmDrawResultResponse> {
  if (USE_MOCK_DRAW_RESULT_API) {
    return mockConfirmDrawResult(mockResult);
  }

  try {
    const response = await fetch(DRAW_RESULT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drawHistoryId }),
    });

    const payload = (await response.json()) as {
      data?: { result?: unknown };
      result?: unknown;
      message?: string;
    };

    if (!response.ok) {
      return {
        status: 'failed',
        message: payload.message ?? '결과 조회에 실패했습니다.',
      };
    }

    const result = payload.data?.result ?? payload.result;

    if (!isDrawResult(result)) {
      return {
        status: 'failed',
        message: '결과 형식이 올바르지 않습니다.',
      };
    }

    return {
      status: 'success',
      result,
    };
  } catch {
    return {
      status: 'failed',
      message: '네트워크 오류로 결과 조회에 실패했습니다.',
    };
  }
}

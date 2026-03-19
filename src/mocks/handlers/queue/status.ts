// ====================================
/* 
  - WAITING → 몇 번 후 READY
    /queue?queueId=test-queue&next=/security-quiz
  - 바로 READY
    /queue?queueId=ready-queue&next=/security-quiz
  - 만료 상태
    /queue?queueId=expired-queue
  - 취소 상태
    /queue?queueId=cancelled-queue
*/
// ====================================

import { http, HttpResponse } from 'msw';
import {
  API_ERROR_CODES,
  API_MESSAGES,
  API_RESPONSE_CODE,
} from '@/constants/api';
import { QueueStatusResponse } from '@/features/queue/types/queue';

const queuePollCountStore = new Map<string, number>();
const DEFAULT_POLL_INTERVAL = 2_000;

function createWaitingResponse(
  queueId: string,
  pollCount: number
): QueueStatusResponse {
  const initialRank = 12843;
  const decreasedRank = Math.max(initialRank - pollCount * 1375, 1);
  const progressPercent = Math.min(
    95,
    Math.max(8, Math.round(((initialRank - decreasedRank) / initialRank) * 100))
  );

  return {
    queueId,
    status: 'WAITING',
    rank: decreasedRank,
    aheadCount: Math.max(decreasedRank - 1, 0),
    progressPercent,
    pollIntervalMs: DEFAULT_POLL_INTERVAL,
    message: '접속량이 많아 순차적으로 입장 중입니다.',
  };
}

export const queueStatusHandler = http.get(
  '/api/queue/status',
  ({ request }) => {
    const url = new URL(request.url);
    const queueId = url.searchParams.get('queueId')?.trim();
    const nextUrl = url.searchParams.get('next');

    if (!queueId) {
      return HttpResponse.json(
        {
          code: API_ERROR_CODES.COMMON.BAD_REQUEST,
          message: API_MESSAGES.COMMON.INVALID_INPUT,
          data: null,
        },
        { status: 400 }
      );
    }

    if (queueId === 'expired-queue') {
      return HttpResponse.json(
        {
          code: API_RESPONSE_CODE.STATUS.SUCCESS,
          message: '대기 시간이 만료되었습니다.',
          data: {
            queueId,
            status: 'EXPIRED',
            rank: null,
            aheadCount: null,
            progressPercent: 100,
            message: '대기 시간이 만료되었습니다. 다시 시도해주세요.',
          },
        },
        { status: 200 }
      );
    }

    if (queueId === 'cancelled-queue') {
      return HttpResponse.json(
        {
          code: API_RESPONSE_CODE.STATUS.SUCCESS,
          message: '대기열이 종료되었습니다.',
          data: {
            queueId,
            status: 'CANCELLED',
            rank: null,
            aheadCount: null,
            progressPercent: 100,
            message: '운영 사정으로 대기열이 종료되었습니다.',
          },
        },
        { status: 200 }
      );
    }

    const nextPollCount = (queuePollCountStore.get(queueId) ?? 0) + 1;
    queuePollCountStore.set(queueId, nextPollCount);

    if (nextPollCount >= 4 || queueId === 'ready-queue') {
      return HttpResponse.json(
        {
          code: API_RESPONSE_CODE.STATUS.SUCCESS,
          message: '입장 가능합니다.',
          data: {
            queueId,
            status: 'READY',
            rank: 0,
            aheadCount: 0,
            progressPercent: 100,
            nextUrl,
            message: '입장 순서가 되어 다음 단계로 이동합니다.',
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        code: API_RESPONSE_CODE.STATUS.SUCCESS,
        message: '대기 중입니다.',
        data: createWaitingResponse(queueId, nextPollCount),
      },
      { status: 200 }
    );
  }
);

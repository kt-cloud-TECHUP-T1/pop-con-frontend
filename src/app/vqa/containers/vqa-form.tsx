'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { snackbar } from '@/components/ui/snackbar';
import { queueTokenStorage } from '@/features/queue/utils/queue-token';
import { useAuthStore } from '@/features/auth/stores/auth-store';

// ── 백엔드 응답 타입 ──────────────────────────────────

/** POST /queues/vqa/start 응답 */
interface VqaStartData {
  isExempt: boolean;
  vqaSessionId: string | null;
  quizPassedToken: string | null;
  firstQuestion: VqaQuestion | null;
}

/** 문제 정보 */
interface VqaQuestion {
  video: { id: number; title: string };
  question: { id: number; text: string };
  is_exempt: boolean | null;
}

/** POST /queues/vqa/submit 응답 */
interface VqaSubmitData {
  isPass: boolean;
  score: number | null;
  quizPassedToken: string | null;
  remainAttempts: number | null;
}

// ── 헬퍼 ──────────────────────────────────────────────

const QUIZ_TIME_LIMIT = 30;
const VQA_VIDEO_BASE = 'https://vqa.botfett.cloud/api/v1/videos';

function buildHeaders(
  accessToken: string | null,
  queueToken: string | null,
  json = false
): Record<string, string> {
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(queueToken ? { 'X-Queue-Token': queueToken } : {}),
  };
}

// ── 컴포넌트 ─────────────────────────────────────────

export default function VqaForm() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 퀴즈 상태
  const [vqaSessionId, setVqaSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<VqaQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  // 타이머
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // ── 퀴즈 시작 요청 ─────────────────────────────────
  useEffect(() => {
    const fetchStart = async () => {
      try {
        const queueToken = queueTokenStorage.get();
        const res = await fetch('/api/vqa', {
          headers: buildHeaders(accessToken, queueToken),
        });
        const json = await res.json();
        const data: VqaStartData | undefined = json?.data;

        if (!data) {
          setHasLoadError(true);
          snackbar.destructive({ title: '퀴즈를 불러오지 못했어요.' });
          return;
        }

        // 면제 → 바로 통과 (isLoading 유지하여 에러 화면 방지)
        if (data.isExempt && data.quizPassedToken) {
          sessionStorage.setItem('quiz_passed_token', data.quizPassedToken);
          const redirect = sessionStorage.getItem('vqa_redirect');
          sessionStorage.removeItem('vqa_redirect');
          router.push(redirect ?? '/');
          return; // isLoading을 false로 바꾸지 않고 로딩 화면 유지
        }

        // 퀴즈 진행
        if (data.vqaSessionId && data.firstQuestion) {
          setVqaSessionId(data.vqaSessionId);
          setQuestion(data.firstQuestion);
          startTimeRef.current = Date.now();
        }
        setIsLoading(false);
      } catch {
        setHasLoadError(true);
        snackbar.destructive({ title: '퀴즈를 불러오지 못했어요.' });
        setIsLoading(false);
      }
    };

    fetchStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 카운트다운 타이머 ──────────────────────────────
  useEffect(() => {
    if (isLoading || !question) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          snackbar.destructive({
            title: '시간이 초과되었어요. 처음부터 다시 시도해주세요.',
          });
          router.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, question, router]);

  // ── 다음 문제 조회 ──────────────────────────────────
  const fetchNextQuestion = async () => {
    try {
      const queueToken = queueTokenStorage.get();
      const res = await fetch(
        `/api/vqa/next?sessionId=${vqaSessionId}`,
        {
          headers: buildHeaders(accessToken, queueToken),
        }
      );
      const json = await res.json();
      const nextQuestion: VqaQuestion | undefined = json?.data;

      if (nextQuestion) {
        setQuestion(nextQuestion);
        setTimeLeft(QUIZ_TIME_LIMIT);
        startTimeRef.current = Date.now();
      }
    } catch {
      // 다음 문제 로드 실패 시 기존 문제 유지
    }
  };

  // ── 답변 제출 ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting || !question || !vqaSessionId) return;

    setIsSubmitting(true);
    const totalTime = (Date.now() - startTimeRef.current) / 1000;

    try {
      const queueToken = queueTokenStorage.get();
      const res = await fetch('/api/vqa', {
        method: 'POST',
        headers: buildHeaders(accessToken, queueToken, true),
        body: JSON.stringify({
          vqaSessionId,
          videoId: question.video.id,
          questionId: question.question.id,
          userAnswer: answer.trim(),
          totalTime,
        }),
      });

      const json = await res.json();
      const data: VqaSubmitData | undefined = json?.data;

      // 통과
      if (data?.isPass && data.quizPassedToken) {
        sessionStorage.setItem('quiz_passed_token', data.quizPassedToken);
        const redirect = sessionStorage.getItem('vqa_redirect');
        sessionStorage.removeItem('vqa_redirect');
        router.push(redirect ?? '/');
        return;
      }

      // 실패 — 남은 횟수 확인
      const remain = data?.remainAttempts ?? 0;

      if (remain <= 0) {
        setIsBlocked(true);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setErrorMessage(
        `정답이 아니에요. 다시 시도해주세요 (${3 - remain}/3회 오답)`
      );
      setAnswer('');

      // 다음 문제 가져오기
      await fetchNextQuestion();
    } catch {
      snackbar.destructive({ title: '오류가 발생했어요. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 로딩 ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.08)] flex flex-col gap-[30px] items-center p-8 w-full">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)] text-center"
        >
          퀴즈를 불러오는 중...
        </Typography>
      </div>
    );
  }

  // ── 에러 ───────────────────────────────────────────
  if (hasLoadError || !question) {
    return (
      <div className="bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.08)] flex flex-col gap-[30px] items-center p-8 w-full">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)] text-center"
        >
          퀴즈를 불러오지 못했어요
        </Typography>
        <Button
          variant="primary"
          size="large"
          className="w-full"
          onClick={() => router.back()}
        >
          이전으로 돌아가기
        </Button>
      </div>
    );
  }

  // ── 퀴즈 화면 ──────────────────────────────────────
  return (
    <div className="relative bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.08)] flex flex-col gap-[30px] items-center p-8 w-full">
      {/* 차단 모달 오버레이 */}
      {isBlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px] bg-black/40">
          <div className="bg-white rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] flex flex-col gap-[20px] items-center px-8 py-6 mx-6 max-w-[360px] w-full">
            <div className="flex flex-col gap-[2px] items-center w-full">
              <Typography
                variant="heading-1"
                weight="bold"
                className="text-[var(--content-high)] text-center"
              >
                잠시 후 다시 이용해주세요
              </Typography>
              <Typography
                variant="label-2"
                as="p"
                className="text-[var(--content-extra-low)] text-center"
              >
                퀴즈를 3번 틀려서 30분간 입장이 제한되었어요
                <br />
                시간을 두고 다시 시도해주세요
              </Typography>
            </div>
            <Button
              variant="primary"
              size="large"
              className="w-full"
              onClick={() => router.push('/')}
            >
              메인으로 돌아가기
            </Button>
          </div>
        </div>
      )}
      {/* Heading */}
      <div className="flex flex-col gap-[2px] items-center w-full">
        <Typography
          variant="heading-1"
          weight="bold"
          className="text-[var(--content-high)] text-center"
        >
          잠시 확인할게요
        </Typography>
        <Typography
          variant="label-2"
          as="p"
          className="text-[var(--content-extra-low)] text-center"
        >
          모두의 공정한 기회를 위해
          <br />
          실제 사용자인지 확인하는 과정이에요
        </Typography>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-full">
        {/* Timer */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-[var(--component-default)] rounded-[10px] px-[2px] py-2 flex gap-1 items-center justify-center">
            <Typography
              variant="label-1"
              className="text-[var(--content-extra-low)]"
            >
              남은 시간
            </Typography>
            <Typography
              variant="body-1"
              weight="bold"
              className="text-[var(--btn-primary-default)]"
            >
              {timeLeft}초
            </Typography>
          </div>

          {/* Video */}
          <div
            className="rounded-[16px] overflow-hidden w-full bg-[var(--component-default)] flex items-center justify-center"
            style={{ aspectRatio: '16/9' }}
          >
            <video
              src={`${VQA_VIDEO_BASE}/${question.video.id}/stream`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Question */}
        <Typography
          variant="title-2"
          weight="bold"
          as="p"
          className="text-[var(--content-high)] text-center w-full"
        >
          {question.question.text}
        </Typography>

        {/* Form */}
        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder="답을 입력해주세요"
            value={answer}
            state={errorMessage ? 'error' : 'default'}
            messages={errorMessage ? { error: errorMessage } : undefined}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '확인'}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-[2px] items-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="8.5" fill="#a3a3a3" />
          <rect x="9.25" y="9" width="1.5" height="5" rx="0.75" fill="white" />
          <circle cx="10" cy="7" r="0.875" fill="white" />
        </svg>
        <Typography
          variant="caption-1"
          className="text-[var(--content-extra-low)]"
        >
          3회 틀리면 30분간 이용이 제한돼요
        </Typography>
      </div>
    </div>
  );
}

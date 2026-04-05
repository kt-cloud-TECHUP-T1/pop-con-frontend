'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { snackbar } from '@/components/ui/snackbar';

interface VqaQuestion {
  failCount: number;
  questionId: string;
  question: string;
  videoUrl: string;
  timeLimit: number;
}
const DUMMY_QUESTION = {
  failCount: 3,
  questionId: 'q1',
  videoUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQWOxKPwNHFjUvdcASruiQwfX6KlzGN5p39g&s',
  question: '이 영상에 있는 동물은 무엇인가요?',
  timeLimit: 3000000,
};

export default function VqaForm() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [questionData, setQuestionData] = useState<VqaQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch('/api/vqa');
        const data = await res.json();
        if (data?.data) {
          setQuestionData(data.data);
          setTimeLeft(data.data.timeLimit ?? 30);
        }
      } catch {
        setQuestionData(DUMMY_QUESTION);
        setTimeLeft(DUMMY_QUESTION.timeLimit);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
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
  }, [router]);

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vqa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: answer.trim(),
          questionId: questionData?.questionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const failCount = data?.data?.failCount ?? questionData?.failCount;
        if (failCount >= 3) {
          setIsBlocked(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        setErrorMessage(
          `정답이 아니에요. 다시 시도해주세요 (${failCount ?? '?'}/3회) 오답`
        );
        setAnswer('');
        return;
      }

      router.back();
    } catch {
      snackbar.destructive({ title: '오류가 발생했어요. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBlocked) {
    return (
      <div className="bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.08)] flex flex-col gap-[30px] items-center p-8 w-full">
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
    );
  }

  return (
    <div className="bg-white rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.12),0px_0px_1px_0px_rgba(0,0,0,0.08)] flex flex-col gap-[30px] items-center p-8 w-full">
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
        {/* Video + Timer */}
        <div className="flex flex-col gap-4 w-full">
          {/* Timer */}
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

          {/* Thumbnail */}
          <div
            className="rounded-[16px] overflow-hidden w-full bg-[var(--component-default)] flex items-center justify-center"
            style={{ aspectRatio: '16/9' }}
          >
            {questionData?.videoUrl ? (
              <video
                src={questionData.videoUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="8"
                  width="40"
                  height="32"
                  rx="2"
                  stroke="#a3a3a3"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="20"
                  r="4"
                  stroke="#a3a3a3"
                  strokeWidth="2"
                />
                <path
                  d="M4 36l10-10 6 6 8-10 16 14"
                  stroke="#a3a3a3"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Question */}
        <Typography
          variant="title-2"
          weight="bold"
          as="p"
          className="text-[var(--content-high)] text-center w-full"
        >
          {questionData?.question ?? ''}
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

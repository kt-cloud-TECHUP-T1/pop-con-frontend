'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wrapper } from '@/components/layout/wrapper';
import { Typography } from '@/components/ui/typography';

interface ErrorPageProps {
  code?: string;
  message?: string;
  onRetry?: () => void;
}

const ERROR_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  NETWORK_ERROR: {
    title: '네트워크 연결에 실패했습니다.',
    description: '인터넷 연결 상태를 확인한 뒤 다시 시도해주세요.',
  },
  S001: {
    title: '시스템 오류가 발생했습니다.',
    description: '잠시 후 다시 시도해줘. 문제가 계속되면 문의가 필요합니다.',
  },
  C001: {
    title: '잘못된 요청입니다.',
    description: '요청값이 올바르지 않아서 화면을 불러올 수 없습니다.',
  },
  INVALID_JSON: {
    title: '응답 데이터를 처리할 수 없습니다.',
    description: '서버 응답 형식에 문제가 있어서 화면을 표시할 수 없습니다.',
  },
  UNKNOWN_ERROR: {
    title: '알 수 없는 오류가 발생했습니다.',
    description: '잠시 후 다시 시도해주세요.',
  },
};

function getErrorContent(code?: string, message?: string) {
  const fallback = {
    title: '문제가 발생했습니다.',
    description: message ?? '잠시 후 다시 시도해주세요.',
  };

  if (!code) return fallback;

  const mapped = ERROR_CONTENT[code];
  if (!mapped) {
    return {
      title: '문제가 발생했습니다.',
      description: message ?? '요청을 처리하는 중 오류가 발생했습니다.',
    };
  }

  return {
    title: mapped.title,
    description: message ?? mapped.description,
  };
}

export function ErrorPage({ code, message, onRetry }: ErrorPageProps) {
  const content = getErrorContent(code, message);

  return (
    <Wrapper className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex w-full max-w-[480px] flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-500">
          {code ? `ERROR ${code}` : 'ERROR'}
        </div>

        <Typography as="h1" variant="heading-2" className="mb-3 text-gray-900">
          {content.title}
        </Typography>

        <Typography
          as="p"
          variant="body-2"
          className="mb-8 whitespace-pre-line text-gray-600"
        >
          {content.description}
        </Typography>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          {onRetry ? (
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="w-full"
              onClick={onRetry}
            >
              다시 시도
            </Button>
          ) : null}

          <Link href="/" className="w-full">
            <Button
              type="button"
              variant="primary"
              size="large"
              className="w-full"
            >
              홈으로 가기
            </Button>
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

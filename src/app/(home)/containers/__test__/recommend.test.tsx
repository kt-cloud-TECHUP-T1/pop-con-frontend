import { render, screen, waitFor } from '@testing-library/react';
import { Recommend } from '../recommend';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import type { ApiResponse } from '@/types/api/common';

jest.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/components/content/card-thumbnail', () => ({
  CardThumbnail: ({ title }: { title: string }) => (
    <div data-testid="card-thumbnail">{title}</div>
  ),
}));

jest.mock('@/components/content/grid-carousel', () => ({
  GridCarousel: ({ items }: { items: React.ReactNode[] }) => (
    <div data-testid="grid-carousel">{items}</div>
  ),
}));

jest.mock('../../components/section', () => ({
  Section: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

const mockRecommendResponse = (items: object[]): ApiResponse<object> => ({
  code: '200',
  message: 'success',
  data: {
    sectionKey: 'RECOMMENDED',
    itemCount: items.length,
    items,
  },
});

const makeRecommendItem = (id: number) => ({
  popupId: id,
  title: `추천 팝업 ${id}`,
  supportingText: `설명 ${id}`,
  subText: null,
  caption: null,
  thumbnailUrl: null,
  liked: null,
  stats: { likeCount: 5, viewCount: 50 },
  overlay: null,
  phase: {
    type: 'DRAW',
    status: 'OPEN',
    openAt: '2026-01-01T00:00:00Z',
    closeAt: '2026-12-31T00:00:00Z',
  },
});

describe('Recommend', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { accessToken: string | null }) => unknown) =>
        selector({ accessToken: null })
    );
  });

  it('추천 데이터가 없으면 빈 상태 메시지를 표시한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRecommendResponse([]),
    });

    render(<Recommend />);

    await waitFor(() => {
      expect(screen.getByText('추천 팝업이 없어요.')).toBeInTheDocument();
    });
  });

  it('추천 데이터가 있으면 카드를 렌더링한다', async () => {
    const items = [makeRecommendItem(1), makeRecommendItem(2)];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRecommendResponse(items),
    });

    render(<Recommend />);

    await waitFor(() => {
      expect(screen.getByText('추천 팝업 1')).toBeInTheDocument();
      expect(screen.getByText('추천 팝업 2')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('card-thumbnail')).toHaveLength(2);
  });

  it('accessToken이 있으면 Authorization 헤더를 포함해 요청한다', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { accessToken: string | null }) => unknown) =>
        selector({ accessToken: 'test-token' })
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRecommendResponse([]),
    });

    render(<Recommend />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/popups/recommended',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  it('accessToken이 없으면 Authorization 헤더 없이 요청한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRecommendResponse([]),
    });

    render(<Recommend />);

    await waitFor(() => {
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1]?.headers ?? {};
      expect(headers).not.toHaveProperty('Authorization');
    });
  });

  it('API 응답이 실패하면 빈 상태 메시지를 표시한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    render(<Recommend />);

    await waitFor(() => {
      expect(screen.getByText('추천 팝업이 없어요.')).toBeInTheDocument();
    });
  });
});

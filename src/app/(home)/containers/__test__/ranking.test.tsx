import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ranking } from '../ranking';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useRouter } from 'next/navigation';
import type { ApiResponse } from '@/types/api/common';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/components/content/card-thumbnail', () => ({
  CardThumbnail: ({
    title,
    onClick,
  }: {
    title: string;
    onClick?: () => void;
  }) => (
    <div data-testid="card-thumbnail" onClick={onClick}>
      {title}
    </div>
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

const mockRankingResponse = (items: object[]): ApiResponse<object> => ({
  code: '200',
  message: 'success',
  data: {
    sectionKey: 'RANKINGS_WEEKLY',
    itemCount: items.length,
    items,
  },
});

const makeRankingItem = (id: number) => ({
  popupId: id,
  title: `랭킹 팝업 ${id}`,
  supportingText: `설명 ${id}`,
  subText: null,
  caption: null,
  thumbnailUrl: null,
  liked: false,
  stats: { likeCount: 10, viewCount: 100 },
  overlay: { type: 'RANK', rank: id },
  phase: {
    type: 'AUCTION',
    status: 'OPEN',
    openAt: '2026-01-01T00:00:00Z',
    closeAt: '2026-12-31T00:00:00Z',
  },
});

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('Ranking', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { accessToken: string | null }) => unknown) =>
        selector({ accessToken: null })
    );
  });

  it('랭킹 데이터가 없으면 빈 상태 메시지를 표시한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRankingResponse([]),
    });

    renderWithQueryClient(<Ranking />);

    await waitFor(() => {
      expect(
        screen.getByText('순위에 오른 팝업이 없어요.')
      ).toBeInTheDocument();
    });
  });

  it('랭킹 데이터가 있으면 카드를 렌더링한다', async () => {
    const items = [makeRankingItem(1), makeRankingItem(2), makeRankingItem(3)];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRankingResponse(items),
    });

    renderWithQueryClient(<Ranking />);

    await waitFor(() => {
      expect(screen.getByText('랭킹 팝업 1')).toBeInTheDocument();
      expect(screen.getByText('랭킹 팝업 2')).toBeInTheDocument();
      expect(screen.getByText('랭킹 팝업 3')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('card-thumbnail')).toHaveLength(3);
  });

  it('accessToken이 있으면 Authorization 헤더를 포함해 요청한다', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { accessToken: string | null }) => unknown) =>
        selector({ accessToken: 'test-token' })
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRankingResponse([]),
    });

    renderWithQueryClient(<Ranking />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/popups/rankings',
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
      json: async () => mockRankingResponse([]),
    });

    renderWithQueryClient(<Ranking />);

    await waitFor(() => {
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1]?.headers ?? {};
      expect(headers).not.toHaveProperty('Authorization');
    });
  });

  it('카드 클릭 시 해당 팝업 상세 페이지로 이동한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRankingResponse([makeRankingItem(42)]),
    });

    renderWithQueryClient(<Ranking />);

    const card = await screen.findByTestId('card-thumbnail');
    await userEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith('/auction/42');
  });

  it('API 응답이 실패하면 빈 상태 메시지를 표시한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    renderWithQueryClient(<Ranking />);

    await waitFor(() => {
      expect(
        screen.getByText('순위에 오른 팝업이 없어요.')
      ).toBeInTheDocument();
    });
  });
});

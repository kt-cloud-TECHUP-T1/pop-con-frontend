import { render, screen, waitFor } from '@testing-library/react';
import { MainBanner } from '../main-banner';
import type { ApiResponse } from '@/types/api/common';

jest.mock('@/components/content/card-overlay', () => ({
  CardOverlay: ({ title }: { title: string }) => (
    <div data-testid="card-overlay">{title}</div>
  ),
}));

jest.mock('@/components/content/grid-carousel', () => ({
  GridCarousel: ({ items }: { items: React.ReactNode[] }) => (
    <div data-testid="grid-carousel">{items}</div>
  ),
}));

const mockBannerResponse = (items: object[]): ApiResponse<object> => ({
  code: '200',
  message: 'success',
  data: {
    sectionKey: 'BANNERS',
    itemCount: items.length,
    items,
  },
});

const makeBannerItem = (id: number) => ({
  popupId: id,
  title: `배너 제목 ${id}`,
  supportingText: `설명 ${id}`,
  subText: null,
  caption: null,
  thumbnailUrl: null,
  liked: null,
  stats: null,
  overlay: null,
  phase: {
    type: 'AUCTION',
    status: 'OPEN',
    openAt: '2026-01-01T00:00:00Z',
    closeAt: '2026-12-31T00:00:00Z',
  },
});

describe('MainBanner', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('배너 데이터가 없으면 아무것도 렌더링하지 않는다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBannerResponse([]),
    });

    const { container } = render(<MainBanner />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('배너 데이터가 있으면 카드를 렌더링한다', async () => {
    const items = [makeBannerItem(1), makeBannerItem(2)];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBannerResponse(items),
    });

    render(<MainBanner />);

    await waitFor(() => {
      expect(screen.getByText('배너 제목 1')).toBeInTheDocument();
      expect(screen.getByText('배너 제목 2')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('card-overlay')).toHaveLength(2);
  });

  it('/api/popups/banners에 GET 요청을 보낸다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBannerResponse([makeBannerItem(1)]),
    });

    render(<MainBanner />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/popups/banners?limit=5', {
        method: 'GET',
      });
    });
  });

  it('API 응답이 실패하면 아무것도 렌더링하지 않는다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    const { container } = render(<MainBanner />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});

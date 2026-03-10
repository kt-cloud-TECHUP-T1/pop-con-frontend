import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  confirmDrawResult,
  type DrawResult,
} from '@/features/mypage/draws/services/confirm-draw-result';
import { getResultBadge } from '@/features/mypage/draws/utils/get-result-badge';

type RevealBadge = ReturnType<typeof getResultBadge>;

// 드로우 결과 공개 흐름을 다양한 목록 아이템 타입에 재사용하기 위한 전략 집합
type UseDrawRevealParams<TItem extends { id: number }> = {
  // 결과 반영 대상 목록 상태 setter
  setItems: Dispatch<SetStateAction<TItem[]>>;
  // 현재 아이템이 "결과 확인하기" 가능한 상태인지 판별
  canReveal: (item: TItem) => boolean;
  // API 호출용 mock 결과(당첨/미당첨) 추출
  getMockResult: (item: TItem) => DrawResult | undefined;
  // 결과 공개 성공 후, 아이템별 도메인 스키마에 맞춰 상태 갱신
  applyRevealResult: (
    item: TItem,
    result: DrawResult,
    badge: RevealBadge
  ) => TItem;
};

// 공통 드로우 결과 확인 훅
// - 모달 상태/비동기 상태를 관리
// - 실제 아이템 필드 업데이트는 호출부 전략(applyRevealResult)으로 위임
export function useDrawReveal<TItem extends { id: number }>({
  setItems,
  canReveal,
  getMockResult,
  applyRevealResult,
}: UseDrawRevealParams<TItem>) {
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedResult, setRevealedResult] = useState<DrawResult | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);

  // 모달 종료 시 결과 확인 플로우 상태 초기화
  const closeRevealModal = () => {
    setIsRevealing(false);
    setRevealedResult(null);
    setRevealError(null);
    setSelectedItem(null);
  };

  // 결과 확인하기 클릭 시 실행되는 함수
  const handleRevealResult = async (item: TItem) => {
    if (!canReveal(item)) return;

    const mockResult = getMockResult(item);
    if (!mockResult) return;

    setSelectedItem(item);
    setIsRevealing(true);
    setRevealedResult(null);
    setRevealError(null);

    const response = await confirmDrawResult({
      drawHistoryId: item.id,
      mockResult,
    });

    if (response.status === 'failed') {
      setIsRevealing(false);
      setRevealError(response.message);
      return;
    }

    // 결과 공개 성공 시, 호출부에서 전달한 전략으로 목록 상태를 동기화
    const badge = getResultBadge(response.result);
    setItems((prev) =>
      prev.map((currentItem) =>
        currentItem.id === item.id
          ? applyRevealResult(currentItem, response.result, badge)
          : currentItem
      )
    );
    setIsRevealing(false);
    setRevealedResult(response.result);
  };

  return {
    selectedItem,
    isRevealing,
    revealedResult,
    revealError,
    closeRevealModal,
    handleRevealResult,
  };
}

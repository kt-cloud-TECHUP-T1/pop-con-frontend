import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { quizPassedTokenStorage } from '@/lib/utils';

const DEFAULT_DATES_ERROR =
  '예약 가능 날짜를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
const DEFAULT_SLOTS_ERROR =
  '회차 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';

interface UseReserveDateSlotsOptions {
  /** 날짜 목록 조회 URL (e.g. `/api/auctions/${id}/dates`) */
  datesUrl: string;
  /** 서버 에러 코드 목록 — 해당 코드면 서버 메시지를 그대로 노출 */
  errorCodes: string[];
}

interface UseReserveDateSlotsReturn<TSlot> {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  availableDates: string[];
  selectedOptionId: number | null;
  setSelectedOptionId: (id: number | null) => void;
  slots: TSlot[];
  datesErrorMessage: string | null;
  slotsErrorMessage: string | null;
  isDatesLoading: boolean;
  isSlotsLoading: boolean;
}

export function useReserveDateSlots<TSlot>({
  datesUrl,
  errorCodes,
}: UseReserveDateSlotsOptions): UseReserveDateSlotsReturn<TSlot> {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [slots, setSlots] = useState<TSlot[]>([]);
  const [datesErrorMessage, setDatesErrorMessage] = useState<string | null>(
    null
  );
  const [slotsErrorMessage, setSlotsErrorMessage] = useState<string | null>(
    null
  );
  const [isDatesLoading, setIsDatesLoading] = useState(true);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  // ------------------------------------------------------------ //
  // ------------- 페이지 진입 시 선택 가능한 날짜 목록 조회 ------------- //
  // ------------------------------------------------------------ //
  useEffect(() => {
    const controller = new AbortController();

    const fetchDates = async () => {
      setIsDatesLoading(true);
      try {
        const quizPassedToken = quizPassedTokenStorage.get();
        const response = await fetch(datesUrl, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Quiz-Passed-Token': quizPassedToken ?? '',
          },
        });
        const result = await response.json();

        if (!response.ok) {
          setAvailableDates([]);
          setDatesErrorMessage(
            errorCodes.includes(result.code)
              ? result.message
              : DEFAULT_DATES_ERROR
          );
          return;
        }

        setDatesErrorMessage(null);
        setAvailableDates(
          result.data?.map((date: { entryDate: string }) => date.entryDate) ??
            []
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[useReserveDateSlots/fetchDates]', error);
        setAvailableDates([]);
        setDatesErrorMessage(DEFAULT_DATES_ERROR);
      } finally {
        setIsDatesLoading(false);
      }
    };

    fetchDates();
    return () => controller.abort();
  }, [datesUrl, accessToken]);

  // ------------------------------------------------------------ //
  // -------------- 날짜 선택 시 해당 날짜의 회차 목록 조회 -------------- //
  // ------------------------------------------------------------ //
  useEffect(() => {
    if (!selectedDate) return;

    const controller = new AbortController();

    const fetchSlots = async () => {
      setSlots([]);
      setSlotsErrorMessage(null);
      setIsSlotsLoading(true);
      try {
        const quizPassedToken = quizPassedTokenStorage.get();
        const response = await fetch(`${datesUrl}/${selectedDate}/options`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Quiz-Passed-Token': quizPassedToken ?? '',
          },
        });
        const result = await response.json();

        if (!response.ok) {
          setSlotsErrorMessage(
            errorCodes.includes(result.code)
              ? result.message
              : DEFAULT_SLOTS_ERROR
          );
          return;
        }

        setSlotsErrorMessage(null);
        setSlots(result.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[useReserveDateSlots/fetchSlots]', error);
        setSlotsErrorMessage(DEFAULT_SLOTS_ERROR);
      } finally {
        setIsSlotsLoading(false);
      }
    };

    fetchSlots();
    return () => controller.abort();
  }, [datesUrl, selectedDate, accessToken]);

  return {
    selectedDate,
    setSelectedDate,
    availableDates,
    selectedOptionId,
    setSelectedOptionId,
    slots,
    datesErrorMessage,
    slotsErrorMessage,
    isDatesLoading,
    isSlotsLoading,
  };
}

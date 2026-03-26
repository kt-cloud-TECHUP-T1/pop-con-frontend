import type { HoneypotData, SignalCollector } from '../types';

export function createHoneypotCollector(): SignalCollector & {
  /** 허니팟 input props - 폼 안에 자연스럽게 배치 */
  getHoneypotProps(): {
    id: string;
    name: string;
    tabIndex: number;
    'aria-hidden': boolean;
    autoComplete: string;
  };
  /** 허니팟을 덮는 overlay props - input 위에 렌더링 */
  getOverlayProps(): {
    style: React.CSSProperties;
  };
  /** 허니팟 wrapper props - relative 컨테이너 */
  getWrapperProps(): {
    style: React.CSSProperties;
  };
} {
  let triggered = false;
  let fieldValue: string | null = null;
  let inputElement: HTMLElement | null = null;
  const cleanupFns: (() => void)[] = [];

  const HONEYPOT_ID = 'confirm_email_field';

  function onInput(e: Event) {
    triggered = true;
    fieldValue = (e.target as HTMLInputElement).value;
  }

  function onFocus() {
    triggered = true;
  }

  return {
    start() {
      inputElement = document.getElementById(HONEYPOT_ID);
      if (inputElement) {
        inputElement.addEventListener('input', onInput);
        inputElement.addEventListener('focus', onFocus);
        cleanupFns.push(
          () => inputElement?.removeEventListener('input', onInput),
          () => inputElement?.removeEventListener('focus', onFocus),
        );
      }
    },

    stop() {
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
    },

    getRawData(): HoneypotData {
      return { triggered, fieldValue };
    },

    /** 허니팟 input - 실제 폼 필드처럼 보이지만 사람은 접근 불가 */
    getHoneypotProps() {
      return {
        id: HONEYPOT_ID,
        name: 'confirm_email', // 매크로가 자동 입력하기 좋은 필드명
        tabIndex: -1,
        'aria-hidden': true as const,
        autoComplete: 'off',
      };
    },

    /** 허니팟 위를 덮는 overlay - 사람은 input을 볼 수 없음 */
    getOverlayProps() {
      return {
        style: {
          position: 'absolute' as const,
          inset: 0,
          zIndex: 1,
          // 배경색은 사용하는 곳에서 페이지 배경에 맞게 설정
          backgroundColor: 'inherit',
        },
      };
    },

    /** wrapper - input과 overlay를 감싸는 컨테이너 */
    getWrapperProps() {
      return {
        style: {
          position: 'relative' as const,
          overflow: 'hidden' as const,
          height: 0,
        },
      };
    },

    reset() {
      triggered = false;
      fieldValue = null;
    },
  };
}

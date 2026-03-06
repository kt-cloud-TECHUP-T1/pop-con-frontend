'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type IndicatorState = {
  x: number;
  width: number;
  opacity: number;
  ready: boolean;
};

const INITIAL_INDICATOR_STATE: IndicatorState = {
  x: 0,
  width: 0,
  opacity: 0,
  ready: false,
};

export function useTabIndicator<Key extends string>(activeKey: Key) {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Partial<Record<Key, HTMLElement | null>>>({});
  const mountedRef = useRef(false);
  const [indicator, setIndicator] = useState<IndicatorState>(
    INITIAL_INDICATOR_STATE
  );

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const containerEl = containerRef.current;
      const activeEl = itemRefs.current[activeKey];

      if (!containerEl || !activeEl) {
        setIndicator((prev) => ({ ...prev, opacity: 0, width: 0 }));
        return;
      }

      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setIndicator((prev) => ({
        x: activeRect.left - containerRect.left,
        width: activeRect.width,
        opacity: 1,
        ready: mountedRef.current ? prev.ready || true : false,
      }));
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => updateIndicator());

    if (containerRef.current) {
      resizeObserver?.observe(containerRef.current);
    }

    if (itemRefs.current[activeKey]) {
      resizeObserver?.observe(itemRefs.current[activeKey] as HTMLElement);
    }

    let frameId = 0;
    if (!mountedRef.current) {
      mountedRef.current = true;
      frameId = requestAnimationFrame(() => {
        setIndicator((prev) => ({ ...prev, ready: true }));
      });
    }

    return () => {
      window.removeEventListener('resize', updateIndicator);
      resizeObserver?.disconnect();

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [activeKey]);

  return {
    indicator,
    setContainerRef: (node: HTMLElement | null) => {
      containerRef.current = node;
    },
    setItemRef: (key: Key) => (node: HTMLElement | null) => {
      itemRefs.current[key] = node;
    },
  };
}

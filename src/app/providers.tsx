'use client';

import { useEffect } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
    };

    init();
  }, []);

  return <>{children}</>;
}

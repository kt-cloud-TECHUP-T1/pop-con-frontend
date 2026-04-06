'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MSWProvider>{children}</MSWProvider>
    </QueryClientProvider>
  );
}

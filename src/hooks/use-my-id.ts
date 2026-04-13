'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { getMyId } from '@/lib/api/get-my-id';

export function useMyId(): string | undefined {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!accessToken) {
      setUserId(undefined);
      return;
    }

    let cancelled = false;

    getMyId(accessToken).then((id) => {
      if (!cancelled) setUserId(id);
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return userId;
}

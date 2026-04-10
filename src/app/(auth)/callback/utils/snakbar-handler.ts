'use client';

import { useEffect } from 'react';
import { snackbar } from '@/components/ui/snackbar';
import { usePathname } from 'next/navigation';
import { SNACKBAR_KEY } from '@/constants/auth';

export function SnackbarHandler() {
  const pathname = usePathname();
  useEffect(() => {
    const raw = sessionStorage.getItem(SNACKBAR_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);

      if (data.type === 'success') {
        snackbar.success({
          title: data.title,
          description: data.description,
        });
      } else {
        snackbar.destructive({
          title: data.title,
          description: data.description,
        });
      }
    } catch (e) {
      console.error('snackbar parse error', e);
    }

    sessionStorage.removeItem(SNACKBAR_KEY);
  }, [pathname]);

  return null;
}

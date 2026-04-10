'use client';

import { useEffect } from 'react';
import { snackbar } from '@/components/ui/snackbar';

export function SnackbarHandler() {
  useEffect(() => {
    const raw = sessionStorage.getItem('login_snackbar');
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

    sessionStorage.removeItem('login_snackbar');
  }, []);

  return null;
}

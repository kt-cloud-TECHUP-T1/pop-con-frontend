import { useAuthStore } from '@/features/auth/stores/auth-store';

let refreshPromise: Promise<string | null> | null = null;

async function silentRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch('/api/auth/token/refresh', {
    method: 'POST',
    cache: 'no-store',
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const result = await res.json();
      return (result.data?.accessToken as string) ?? null;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, setAccessToken, clearAccessToken, setAuthLoading } =
    useAuthStore.getState();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  if (response.status !== 401) return response;

  setAuthLoading();

  const newToken = await silentRefresh();

  if (!newToken) {
    clearAccessToken();
    return response;
  }

  setAccessToken(newToken);

  // 원래 요청 재시도
  const retryResponse = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  });

  if (retryResponse.status === 401) {
    clearAccessToken();
  }

  return retryResponse;
}

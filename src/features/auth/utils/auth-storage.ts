const ACCESS_TOKEN_KEY = 'accessToken';

const isBrowser = () => typeof window !== 'undefined';

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken?: string) {
  if (!isBrowser()) return;

  if (accessToken) {
    // NOTE: 리프레시 토큰은 보안 이슈로 더 이상 프론트 storage에서 다루지 않음
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

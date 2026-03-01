const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
export const AUTH_CHANGE_EVENT_NAME = 'auth-change';

const isBrowser = () => typeof window !== 'undefined';

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export function setAuthTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
}) {
  if (!isBrowser()) return;

  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT_NAME));
}

export function clearAuthTokens() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT_NAME));
}

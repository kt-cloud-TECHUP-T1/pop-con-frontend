const KEY = 'queue_token';

export const queueTokenStorage = {
  save: (token: string) => sessionStorage.setItem(KEY, token),
  get: () => sessionStorage.getItem(KEY),
  remove: () => sessionStorage.removeItem(KEY),
};

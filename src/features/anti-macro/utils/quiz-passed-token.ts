const KEY = 'quiz_passed_token';

export const quizPassedTokenStorage = {
  save: (token: string) => sessionStorage.setItem(KEY, token),
  get: () => sessionStorage.getItem(KEY),
  remove: () => sessionStorage.removeItem(KEY),
};

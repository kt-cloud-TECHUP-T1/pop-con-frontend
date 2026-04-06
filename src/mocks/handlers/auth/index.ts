import { identityCompleteHandler } from './identity-complete';
import { signupHandler } from './signup';
import { tokenRefreshHandler } from './token-refresh';

export const authHandlers = [
  identityCompleteHandler,
  signupHandler,
  tokenRefreshHandler,
];

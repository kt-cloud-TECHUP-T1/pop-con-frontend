export type TokenPayload = {
  registerToken?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type IdentityNextStep = 'TERMS' | 'HOME';

export type IdentityCompleteData = TokenPayload & {
  isNewUser: boolean;
  userId?: number;
  nextStep?: IdentityNextStep;
  expiresAt?: string;
};

export type TokenPayload = {
  registerToken?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type IdentityNextStep = 'TERMS' | 'HOME';

export type IdentityCompleteData = {
  isNewUser: boolean;
  userId?: number;
  accessToken?: string;
  refreshToken?: string;
  nextStep?: IdentityNextStep;
  expiresAt?: string;
};

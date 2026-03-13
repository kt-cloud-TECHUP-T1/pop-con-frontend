export type SignupAgreements = {
  isPrivacyPolicyAgreed: boolean;
  isIdentifierPolicyAgreed: boolean;
  isServicePolicyAgreed: boolean;
  isMarketingAgreed?: boolean;
};

export type SignupRequest = {
  registerToken: string;
  agreements: SignupAgreements;
};

export type SignupCompleteData = {
  userId: number;
  name: string;
  accessToken: string;
  refreshToken: string;
  joinedAt: string;
};

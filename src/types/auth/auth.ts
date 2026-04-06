export interface RefreshTokenResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
  } | null;
}

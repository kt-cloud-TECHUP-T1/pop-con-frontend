export interface RefreshTokenResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
  } | null;
}

export interface SuperLoginResponse {
  code: string;
  message: string;
  data: {
    userId: number;
    accessToken: string;
    expiresIn: number;
  } | null;
}

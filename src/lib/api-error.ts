// src/lib/api/api-error.ts

export class ApiError extends Error {
  public code: string;
  public status?: number;
  public data?: unknown;

  constructor({
    code,
    message,
    status,
    data,
  }: {
    code: string;
    message: string;
    status?: number;
    data?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

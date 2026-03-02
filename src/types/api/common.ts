export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T | null;
};

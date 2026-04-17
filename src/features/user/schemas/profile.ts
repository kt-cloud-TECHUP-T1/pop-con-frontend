import { z } from 'zod';
import { PROFILE_MESSAGES } from '@/features/user/constants/profile';

export const profileNicknameSchema = z
  .string()
  .regex(/^[가-힣a-zA-Z0-9_]{2,20}$/, {
    message: PROFILE_MESSAGES.ERROR.INVALID_NICKNAME,
  });

export type ProfileNicknameForm = z.infer<typeof profileNicknameSchema>;

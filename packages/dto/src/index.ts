import { z } from 'zod';

export const UpdateUserDto = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof LoginDto>;

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100).optional(),
});

export type RegisterDto = z.infer<typeof RegisterDto>;

export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDto>;

export const ResetPasswordDto = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;

export const PaginationDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationDto = z.infer<typeof PaginationDto>;

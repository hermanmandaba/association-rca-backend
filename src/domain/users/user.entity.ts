import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'member']);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: userRoleSchema,
  associationId: z.string().optional().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema.default('admin'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

import { z } from 'zod';

export const memberSchema = z.object({
  id: z.string(),
  associationId: z.string(),
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type Member = z.infer<typeof memberSchema>;

export const createMemberSchema = z.object({
  associationId: z.string(),
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
});

export const updateMemberSchema = z.object({
  id: z.string(),
  associationId: z.string(),
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
});

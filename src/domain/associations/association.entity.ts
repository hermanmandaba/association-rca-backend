import { z } from 'zod';

export const associationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
});

export type Association = z.infer<typeof associationSchema>;

export const createAssociationSchema = z.object({
  userId: z.string(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
});

export const updateAssociationSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
});
